import { DocumentSaleModel } from './../models/document-model';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    catchError,
    firstValueFrom,
    throwError,
    timeout,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaymentSaleModel } from '../../sales-payment/models/payment-sale-model';
import { DbLocalService } from 'src/app/service/db-local.service';
import { DatePipe } from '@angular/common';
import { DocumentSaleDetailModel } from '../models/document-detail-model';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class SalesService {
    constructor(
        private http: HttpClient,
        private db: DbLocalService,
        private datePipe: DatePipe,
        private connectionStateService: ConnectionStateService
    ) {}

    invoiceDetail: DocumentSaleDetailModel[] = [];

    private _isSync: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    get isSync$(): Observable<boolean> {
        return this._isSync.asObservable();
    }

    setIsSync(value: boolean): void {
        this._isSync.next(value);
    }
    //Orders
    private async getOfflineOrders(): Promise<DocumentSaleModel[]> {
        const ordersOffline = await this.db.orderSales.toArray();
        return ordersOffline.map(order => ({
            ...order,
            detailDto: order.detail
        }));
    }

    async getOrderActive() {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetOrderSaleActive`
            )
        );
    }

    async getOrder() {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetOrderSale`
            )
        );
    }

    async getOrderByDate(from: string, to: string): Promise<DocumentSaleModel[]> {
        // Si estamos en modo offline forzado o sin conexión, directamente usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            return this.getOfflineOrders();
        }

        try {
            // Intentar obtener datos del servidor
            const invoices = await firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetOrderSaleByDate/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching orders:', error);
                            return throwError(
                                () => new Error('Error en la solicitud HTTP')
                            );
                        })
                    )
            );

            // Obtener y combinar con órdenes offline
            const offlineOrders = await this.getOfflineOrders();
            return [...offlineOrders, ...invoices];

        } catch (error) {
            // En caso de error, devolver solo los datos locales
            console.warn('Fallback to offline data due to error:', error);
            return this.getOfflineOrders();
        }
    }

    async getOrderById(id: number) {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetOrderSaleById/${id}`
            )
        );
    }

    async addOrder(entry: DocumentSaleModel) {
        return await firstValueFrom(
            this.http.post<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/AddOrderSale`,
                entry
            )
        );
    }

    async updateOrder(entry: DocumentSaleModel) {
        return await firstValueFrom(
            this.http.put<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/UpdateOrderSale`,
                entry
            )
        );
    }

    async cancelOrder(entry: number) {
        return await firstValueFrom(
            this.http.put<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/CanceledOrderSale${entry}`,
                entry
            )
        );
    }

    //Invoices
    async getInvoice() {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetInvoiceSale`
            )
        );
    }

    async getInvoiceActive() {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetInvoiceSaleActive`
            )
        );
    }

    private async getOfflineInvoices(idCustomer: number): Promise<DocumentSaleModel[]> {
        return await this.db.invoiceSeller
            .where('customerId')
            .equals(idCustomer)
            .toArray();
    }

    async getInvoiceActiveCustomer(idCustomer: number): Promise<DocumentSaleModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline data due to offline mode');
            return this.getOfflineInvoices(idCustomer);
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleActiveCustomer${idCustomer}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching invoices:', error);
                            return throwError(() => error);
                        }),
                        timeout(150000)
                    )
            );

            const invoice = await Promise.race([
                apiDataPromise,
                new Promise<DocumentSaleModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out');
                        resolve([]);
                    }, 150000)
                )
            ]);

            // Si invoice está vacío, significa que se resolvió el timeout
            if (invoice.length === 0) {
                throw new Error('API request timed out');
            }

            return invoice;

        } catch (error) {
            console.warn('Fallback to offline data due to error:', error);
            return this.getOfflineInvoices(idCustomer);
        }
    }

    private async getOfflineSellerInvoices(): Promise<DocumentSaleModel[]> {
        return await this.db.invoiceSeller.toArray();
    }

    async getInvoiceActiveSeller(idSeller: number): Promise<DocumentSaleModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline data due to offline mode');
            return this.getOfflineSellerInvoices();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleActiveSeller${idSeller}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching seller invoices:', error);
                            return throwError(() => error);
                        }),
                        timeout(5000)
                    )
            );

            const invoices = await Promise.race([
                apiDataPromise,
                new Promise<DocumentSaleModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 3 seconds');
                        resolve([]);
                    }, 3000)
                )
            ]);

            // Si invoices está vacío, significa que se resolvió el timeout
            if (invoices.length === 0) {
                throw new Error('API request timed out');
            }

            // Actualizar la base de datos local con los nuevos datos
            try {
                await this.db.invoiceSeller.clear();
                await Promise.all(
                    invoices.map((inv) => this.db.invoiceSeller.add(inv))
                );
                console.log('Successfully updated local database with new invoices');
            } catch (dbError) {
                console.error('Error updating local database:', dbError);
                // No lanzamos el error para no interrumpir el flujo principal
            }

            return invoices;

        } catch (error) {
            console.warn('Fallback to offline data due to error:', error);
            return this.getOfflineSellerInvoices();
        }
    }

    private async getOfflineDateInvoices(): Promise<DocumentSaleModel[]> {
        const invoicesOffline = await this.db.invoice.toArray();
        return invoicesOffline.map(invoice => ({
            ...invoice,
            detailDto: invoice.detail
        }));
    }

    async getInvoiceByDate(from: string, to: string): Promise<DocumentSaleModel[]> {
        // Obtenemos primero los datos offline ya que los necesitaremos en ambos casos
        const offlineInvoices = await this.getOfflineDateInvoices();

        // Si estamos en modo offline forzado o sin conexión, usar solo datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline data due to offline mode');
            return offlineInvoices;
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleByDate/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching invoices by date:', error);
                            return throwError(() => 'Error en la solicitud HTTP');
                        }),
                        timeout(15000)
                    )
            );

            const onlineInvoices = await Promise.race([
                apiDataPromise,
                new Promise<DocumentSaleModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 5 seconds');
                        resolve([]);
                    }, 150000)
                )
            ]);

            // Combinar facturas online y offline
            const combinedInvoices = [...offlineInvoices, ...onlineInvoices];

            // Eliminar posibles duplicados basados en algún identificador único
            const uniqueInvoices = Array.from(new Map(
                combinedInvoices.map(invoice => [invoice.docId, invoice])
            ).values());

            console.log(`Combined ${offlineInvoices.length} offline and ${onlineInvoices.length} online invoices`);
            return uniqueInvoices;

        } catch (error) {
            console.warn('Fallback to offline data due to error:', error);
            return offlineInvoices;
        }
    }

    async getInvoiceById(id: number) {
        return await firstValueFrom(
            this.http.get<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/GetInvoiceSaleById/${id}`
            )
        );
    }

    async addInvoice(entry: DocumentSaleModel) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .post<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/AddInvoiceSale`,
                        entry
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(20000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            return (await Promise.race([
                apiDataPromise,
                new Promise((_, reject) =>
                    setTimeout(() => reject('Timeout'), 20000)
                ),
            ])) as DocumentSaleModel[];
        } catch (error) {
            throw error;
        }
    }

    async updateInvoice(entry: DocumentSaleModel) {
        return await firstValueFrom(
            this.http.put<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/UpdateInvoiceSale`,
                entry
            )
        );
    }

    async cancelInvoice(entry: number) {
        return await firstValueFrom(
            this.http.put<DocumentSaleModel[]>(
                `${environment.uriLogistic}/api/Sales/CanceledInvoiceSale${entry}`,
                entry
            )
        );
    }
}
