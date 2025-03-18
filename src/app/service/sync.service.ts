import { PriceSpecialCustomerModel } from './../pages/customers/models/price-special-customer';
import { Injectable } from '@angular/core';
import { DbLocalService } from './db-local.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    firstValueFrom,
    tap,
    throwError,
    timeout,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemWareHouse } from '../pages/items/models/item-warehouse';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthService } from './users/auth.service';
import { SalesService } from '../pages/sale/services/sales.service';
import { Messages } from '../helpers/messages';
import { CustomersService } from '../pages/customers/service/customers.service';
import { ServiceWareHouseService } from '../pages/items/warehouse/service/service-ware-house.service';
import { SellerService } from '../pages/seller/service/seller.service';
import { CommonService } from './common.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DatePipe } from '@angular/common';
import { PaymentSalesService } from '../pages/sales-payment/service/payment-sales.service';
import { ConnectionStateService } from './connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class SyncService {
    currentState: ConnectionState;
    status: boolean;
    usuario: User;
    syncInvoicesInProgress: boolean = false;
    syncProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private totalItems: number = 0;
    private syncedItems: number = 0;

    constructor(
        private db: DbLocalService,
        private connectionService: ConnectionService,
        private connectionStateService: ConnectionStateService,
        private http: HttpClient,
        private auth: AuthService,
        private invoiceService: SalesService,
        private customerServices: CustomersService,
        private wareHouseService: ServiceWareHouseService,
        private sellerService: SellerService,
        private commonService: CommonService,
        private dashboardService: DashboardService,
        private datePipe: DatePipe,
        private paymentServices: PaymentSalesService
    ) {
        this.usuario = this.auth.UserValue;
        this.initConnectionMonitor();
        this.initService();
        this.syncData();
    }

    private initConnectionMonitor() {
        combineLatest([
            this.connectionService.monitor(),
            this.connectionStateService.forceOffline$,
        ])
            .pipe(
                tap(([networkState, forceOffline]) => {
                    this.currentState = networkState;
                    this.status =
                        networkState.hasNetworkConnection && !forceOffline;
                    console.log(
                        `Network: ${networkState.hasNetworkConnection}, Force Offline: ${forceOffline}, Final Status: ${this.status}`
                    );
                })
            )
            .subscribe();
    }

    private async getOfflineInventory(
        whsCode: number
    ): Promise<ItemWareHouse[]> {
        return await this.db.inventory.toArray();
    }

    async getAllItemsWareHousePrice(whsCode: number) {
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline inventory data due to offline mode');
            return this.getOfflineInventory(whsCode);
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<ItemWareHouse[]>(
                        `${environment.uriLogistic}/api/Item/AlltemStockWareHousePrice${whsCode}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching inventory:', error);
                            return throwError(() => error);
                        }),
                        timeout(5000)
                    )
            );

            const inventory = await Promise.race([
                apiDataPromise,
                new Promise<ItemWareHouse[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 3 seconds');
                        resolve([]);
                    }, 3000)
                ),
            ]);

            if (!inventory || inventory.length === 0) {
                throw new Error(
                    'No inventory data received or timeout occurred'
                );
            }

            try {
                await this.db.inventory.clear();
                await this.db.inventory.bulkPut(inventory);
                console.log('Successfully updated local inventory database');
            } catch (dbError) {
                console.error(
                    'Error updating local inventory database:',
                    dbError
                );
            }

            return inventory;
        } catch (error) {
            console.warn(
                'Fallback to offline inventory data due to error:',
                error
            );
            return this.getOfflineInventory(whsCode);
        }
    }

    private async getOfflineSpecialPrices(): Promise<
        PriceSpecialCustomerModel[]
    > {
        return await this.db.specialPrices.toArray();
    }

    async getAllSpecialPriceCustomer() {
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline special prices due to offline mode');
            return this.getOfflineSpecialPrices();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<PriceSpecialCustomerModel[]>(
                        `${environment.uriLogistic}/api/Item/GetAllPriceSpecialCustomer`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error(
                                'Error fetching special prices:',
                                error
                            );
                            return throwError(() => error);
                        }),
                        timeout(5000)
                    )
            );

            const prices = await Promise.race([
                apiDataPromise,
                new Promise<PriceSpecialCustomerModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 3 seconds');
                        resolve([]);
                    }, 3000)
                ),
            ]);

            if (!prices || prices.length === 0) {
                throw new Error(
                    'No special prices data received or timeout occurred'
                );
            }

            try {
                await this.db.specialPrices.clear();
                await this.db.specialPrices.bulkPut(prices);
                console.log(
                    'Successfully updated local special prices database'
                );
            } catch (dbError) {
                console.error(
                    'Error updating local special prices database:',
                    dbError
                );
            }

            return prices;
        } catch (error) {
            console.warn(
                'Fallback to offline special prices due to error:',
                error
            );
            return this.getOfflineSpecialPrices();
        }
    }

    private updateProgress() {
        const progress = (this.syncedItems / this.totalItems) * 100;
        this.syncProgress.next(Math.round(progress));
    }

    async syncAll() {
        if (this.connectionStateService.isEffectivelyOffline()) {
            Messages.Toas(
                'Sin conexión',
                'warning'
            );
            return;
        }

        try {
            this.syncProgress.next(0);
            this.syncedItems = 0;

            const paymentsCount = (await this.db.payment.toArray()).length;
            const invoicesCount = (await this.db.invoice.toArray()).length;
            const ordersCount = (await this.db.orderSales.toArray()).length;
            this.totalItems = paymentsCount + invoicesCount + ordersCount + 5;

            await this.syncPayments();
            await this.syncInvoices();
            await this.syncData();

            this.syncProgress.next(100);
            Messages.Toas('Sincronización completada correctamente');
        } catch (error) {
            console.error('Sync failed:', error);
            this.syncProgress.next(0);
            Messages.warning('Error', 'Error durante la sincronización');
        }
    }

    async syncPayments() {
        if (this.connectionStateService.isEffectivelyOffline()) return;

        let paymentOffline = await this.db.payment.toArray();
        if (paymentOffline.length > 0) {
            Messages.Toas('Sincronizando pagos');
            for (const payment of paymentOffline) {
                try {
                    await this.paymentServices.addPaymentSales(payment);
                    await this.db.payment.delete(payment.id);
                    this.syncedItems++;
                    this.updateProgress();
                } catch (ex) {
                    if (
                        ex.error?.message ===
                        'Error: Esta pago ya existe en la base de datos. UUID'
                    ) {
                        await this.db.payment.delete(payment.id);
                    }
                    await Messages.warning(
                        'Advertencia',
                        ex.error?.message || 'Error al sincronizar el pago'
                    );
                }
            }
        }
    }

    async syncInvoices() {
        if (this.connectionStateService.isEffectivelyOffline()) return;

        try {
            Messages.Toas('Sincronizando facturas');
            this.invoiceService.setIsSync(true);

            const invoicesOffline = await this.db.invoice.toArray();
            const ordersOffline = await this.db.orderSales.toArray();

            if (invoicesOffline.length > 0) {
                for (const invoice of invoicesOffline) {
                    invoice.detailDto = invoice.detail;
                    try {
                        await this.invoiceService.addInvoice(invoice);
                        await this.db.invoice.delete(invoice.id);
                        this.syncedItems++;
                        this.updateProgress();
                    } catch (ex) {
                        if (
                            ex.error?.message ===
                            'Error: Esta factura ya existe en la base de datos. UUID'
                        ) {
                            await this.db.invoice.delete(invoice.id);
                        }
                        await Messages.warning(
                            'Advertencia',
                            ex.error?.message ||
                                'Error al sincronizar la factura'
                        );
                    }
                }
            }

            if (ordersOffline.length > 0) {
                for (const order of ordersOffline) {
                    try {
                        await this.invoiceService.addOrder(order);
                        await this.db.orderSales.delete(order.id);
                        this.syncedItems++;
                        this.updateProgress();
                    } catch (ex) {
                        Messages.warning(
                            'Advertencia',
                            ex.error?.message || 'Error al sincronizar la orden'
                        );
                    }
                }
            }

            await this._getNumeration();
            this.invoiceService.setIsSync(false);
        } catch (ex) {
            this.invoiceService.setIsSync(false);
            Messages.warning(
                'Advertencia',
                ex.error?.message || 'Error en la sincronización de facturas'
            );
        }
    }

    async syncData() {
        if (!this.status) {
            Messages.Toas(
                'Sin conexión',
                'warning'
            );
            return;
        }

        try {
            this.syncedItems++;
            this.updateProgress();

            const tasks = [
                this.customerServices.getCustomerActive(),
                this.getAllItemsWareHousePrice(this.usuario.whsCode),
                this.getAllSpecialPriceCustomer(),
                this._getSaleOrderActive(),
                this._getSellers(),
                this._getNumeration(),
                this.invoiceService.getInvoiceActiveSeller(
                    this.usuario.sellerId
                ),
            ];

            for (const task of tasks) {
                await task;
                this.syncedItems++;
                this.updateProgress();
            }

            Messages.closeLoading();
            Messages.Toas('Datos sincronizados correctamente');
        } catch (error) {
            Messages.warning(
                'Error',
                'Error durante la sincronización de datos'
            );
            console.error('Sync data failed:', error);
        }
    }

    async _getSellers() {
        try {
            await Promise.all([
                this.commonService.getPayConditionActive(),
                this.sellerService.getSeller(),
                this.wareHouseService.getWarehouseActive(),
            ]);
        } catch (ex) {
            Messages.warning(
                'Advertencia',
                ex.error?.message || 'Error al obtener vendedores'
            );
        }
    }

    async _getNumeration() {
        try {
            await this.commonService.getCorrelativeInvoiceById(
                this.usuario.sarCorrelativeId
            );
        } catch (ex) {
            Messages.warning(
                'Advertencia',
                ex.error?.message || 'Error al obtener numeración'
            );
        }
    }

    async _getSaleOrderActive() {
        try {
            const fechaInicio = this.datePipe.transform(
                new Date(),
                'yyyy-MM-dd'
            );
            const fechaFin = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

            await Promise.all([
                this.invoiceService.getOrderActive(),
                this.invoiceService.getInvoiceByDate(fechaInicio, fechaFin),
            ]);
        } catch (ex) {
            console.log(ex);
            Messages.warning(
                'Advertencia',
                ex.error?.message || 'Error al obtener órdenes activas'
            );
        }
    }

    private initService() {
        // Obtener información de la conexión del navegador
        const conn = (navigator as any).connection;
        if (conn) {
            const connectionTypes = ['slow-2g', '2g', '3g', '4g'];
            const effectiveType = conn.effectiveType;
            console.log('Connection type:', effectiveType);
        }
    }
}
