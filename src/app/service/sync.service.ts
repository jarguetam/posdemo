import { Injectable } from '@angular/core';
import { DbLocalService } from './db-local.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { firstValueFrom, tap } from 'rxjs';
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

@Injectable({
    providedIn: 'root',
})
export class SyncService {
    currentState: ConnectionState;
    status: boolean;
    usuario: User;
    syncInvoicesInProgress: boolean = false;

    constructor(
        private db: DbLocalService,
        private connectionService: ConnectionService,
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
        this.connectionService
            .monitor()
            .pipe(
                tap(async (newState: ConnectionState) => {
                    this.currentState = newState;
                    if (this.currentState.hasNetworkConnection) {
                        this.status = true;
                        // Verifica si la sincronización ya está en curso
                        if (!this.syncInvoicesInProgress) {
                            // Marca la sincronización como en curso
                            this.syncInvoicesInProgress = true;
                            try {
                                await this.syncInvoices();
                                await this.syncPayments();
                            } finally {
                                // Marca la sincronización como completa, independientemente del resultado
                                this.syncInvoicesInProgress = false;
                            }
                        }
                    } else {
                        this.status = false;
                    }
                })
            )
            .subscribe();
        this.initService();
        this.syncData();
    }

    async getAllItemsWareHousePrice(whsCode: number) {
        try {
            let inventory = await firstValueFrom(
                this.http.get<ItemWareHouse[]>(
                    `${environment.uriLogistic}/api/Item/AlltemStockWareHousePrice${whsCode}`
                )
            );
            this.db.inventory.clear();
            inventory.map((x) => this.db.inventory.add(x));
            return inventory;
        } catch {
            let data = await this.db.inventory.toArray();
            return data;
        }
    }

    async syncInvoices() {
        try {
            this.invoiceService.setIsSync(true);
            let invoicesOffline = await this.db.invoice.toArray();
            let ordersOffline = await this.db.orderSales.toArray();
            if (invoicesOffline.length > 0) {
                Messages.Toas('Sincronizando datos');
                invoicesOffline.map(
                    (invoice) => (invoice.detailDto = invoice.detail)
                );
                for (const invoice of invoicesOffline) {
                    try {
                        // Intenta agregar la factura en el servicio.
                        await this.invoiceService.addInvoice(invoice);
                        // Si la factura se agrega correctamente, elimina el registro localmente.
                        await this.db.invoice.delete(invoice.id);
                    } catch (ex) {
                        await Messages.warning('Advertencia: ' + ex.error.message);
                    }
                }
            }
            if (ordersOffline.length > 0) {
                for (const orders of ordersOffline) {
                    try {
                        // Intenta agregar la factura en el servicio.
                        await this.invoiceService.addOrder(orders);
                        // Si la factura se agrega correctamente, elimina el registro localmente.
                        await this.db.orderSales.delete(orders.id);
                    } catch (ex) {
                        Messages.Toas('Advertencia: ' + ex);
                    }
                }
            }
            await this._getNumeration();
            Messages.closeLoading();
            Messages.Toas('Facturas, pagos y pedidos sincronizados.');
            this.invoiceService.setIsSync(false);
        } catch (ex) {
            this.invoiceService.setIsSync(false);
            Messages.closeLoading();
            Messages.Toas('Advertencia: ' + ex);
        }
    }

    async syncPayments() {
        try {
            let paymentOffline = await this.db.payment.toArray();
            if (paymentOffline.length > 0) {
                Messages.Toas('Sincronizando Facturas y pagos');
                for (const payment of paymentOffline) {
                    try {
                        // Intenta agregar la factura en el servicio.
                        await this.paymentServices.addPaymentSales(payment);
                        // Si la factura se agrega correctamente, elimina el registro localmente.
                        await this.db.payment.delete(payment.id);
                    } catch (ex) {
                        Messages.Toas('Advertencia: ' + ex);
                    }
                }
                Messages.closeLoading();
            }
        } catch (ex) {
            Messages.closeLoading();
            Messages.Toas('Advertencia: ' + ex);
        }
    }

    async syncData() {
        if (this.status == true) {
            Messages.Toas('Sincronizacion de datos');
            await this.customerServices.getCustomerActive();
            await this.getAllItemsWareHousePrice(this.usuario.whsCode);
            // await this._getWareHouse();
            await this._getSaleOrderActive();
            await this._getSellers();
            await this._getNumeration();
            await this.dashboardService.getData(this.usuario.userId);
            await this.invoiceService.getInvoiceActiveSeller(
                this.usuario.sellerId
            );
            Messages.closeLoading();
        }
    }

    async _getSellers() {
        try {
            await this.commonService.getPayConditionActive();
            await this.sellerService.getSeller();
            await this.wareHouseService.getWarehouseActive();
        } catch (ex) {
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async _getNumeration() {
        try {
            await this.commonService.getCorrelativeInvoiceById(
                this.usuario.sarCorrelativeId
            );
        } catch (ex) {
            Messages.warning('Advertencia', ex.error.message);
        }
    }
    async _getSaleOrderActive() {
        try {
            const fechaInicio = this.datePipe.transform(
                Date.now(),
                'yyyy-MM-dd'
            );
            const fechaFin = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
            await this.invoiceService.getOrderActive();
            await this.invoiceService.getInvoiceByDate(fechaInicio, fechaFin);
        } catch (ex) {
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    initService() {
        const conn = (navigator as any).connection;
        if (conn) {
            if (conn.saveData) {
                // do something
            }
            const connectionlist = ['slow-2g', '2g', '3g', '4g'];
            const effectiveType = conn.effectiveType;
        }
    }
}
