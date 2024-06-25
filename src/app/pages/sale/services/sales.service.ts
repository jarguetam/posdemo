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

@Injectable({
    providedIn: 'root',
})
export class SalesService {
    constructor(
        private http: HttpClient,
        private db: DbLocalService,
        private datePipe: DatePipe
    ) {}
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

    async getOrderByDate(from: string, to: string) {
        try {
            let invoices = await firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetOrderSaleByDate/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) => {
                            return throwError(
                                () => 'Error en la solicitud HTTP'
                            );
                        })
                    )
            );
            let ordersOffline = await this.db.orderSales.toArray();
            ordersOffline.map(
                (invoice) => (invoice.detailDto = invoice.detail)
            );
            let combinedOrders = [...ordersOffline, ...invoices];
            return combinedOrders;
        } catch (error) {
            let ordersOffline = await this.db.orderSales.toArray();
            return ordersOffline;
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

    async getInvoiceActiveCustomer(idCustomer: number) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleActiveCustomer${idCustomer}`
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );

            const invoice = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(() => resolve([]), 3000)), // Devuelve un array vacío si la API no responde en 3 segundos
            ])) as DocumentSaleModel[];

            // Si invoice está vacío, significa que se resolvió el timeout
            if (invoice.length === 0) {
                throw new Error('API request timed out');
            }

            return invoice;
        } catch (ex) {
            const data = await this.db.invoiceSeller
                .where('customerId')
                .equals(idCustomer)
                .toArray();
            return data;
        }
    }

    async getInvoiceActiveSeller(idSeller: number) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleActiveSeller${idSeller}`
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );

            const invoices = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(() => resolve([]), 3000)), // Devuelve un array vacío si la API no responde en 3 segundos
            ])) as DocumentSaleModel[];

            // Si invoices está vacío, significa que se resolvió el timeout
            if (invoices.length === 0) {
                throw new Error('API request timed out');
            }

            await this.db.invoiceSeller.clear();
            await Promise.all(
                invoices.map((inv) => this.db.invoiceSeller.add(inv))
            );

            return invoices;
        } catch (error) {
            const invoicesOffline = await this.db.invoiceSeller.toArray();
            return invoicesOffline;
        }
    }

    async getInvoiceByDate(from: string, to: string) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<DocumentSaleModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetInvoiceSaleByDate/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) =>
                            throwError(() => 'Error en la solicitud HTTP')
                        ),
                        timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            const invoices = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(resolve, 5000)),
            ])) as DocumentSaleModel[];

            let invoicesOffline = await this.db.invoice.toArray();
            invoicesOffline.map(
                (invoice) => (invoice.detailDto = invoice.detail)
            );
            let combinedInvoices = [...invoicesOffline, ...invoices];
            return combinedInvoices;
        } catch (error) {
            let invoicesOffline = await this.db.invoice.toArray();
            return invoicesOffline;
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
