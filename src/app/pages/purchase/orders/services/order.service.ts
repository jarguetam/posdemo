import { DocumentModel } from './../../models/document';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class OrderPurchaseService {
    constructor(private http: HttpClient) {}
    //Orders
    async getOrderActive() {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetOrderPurchaseActive`
            )
        );
    }
    async getOrder() {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetOrderPurchase`
            )
        );
    }

    async getOrderByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetOrderPurchaseByDate/${from}/${to}`
            )
        );
    }

    async getOrderById(id: number) {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetOrderPurchaseById/${id}`
            )
        );
    }

    async addOrder(entry: DocumentModel) {
        return await firstValueFrom(
            this.http.post<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/AddOrderPurchase`,
                entry
            )
        );
    }

    async updateOrder(entry: DocumentModel) {
        return await firstValueFrom(
            this.http.put<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/UpdateOrderPurchase`,
                entry
            )
        );
    }

    async cancelOrder(entry: number) {
        return await firstValueFrom(
            this.http.put<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/CanceledOrderPurchase${entry}`,
                entry
            )
        );
    }

    //Invoices
    async getInvoice() {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchase`
            )
        );
    }

    async getInvoiceActive() {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchaseActive`
            )
        );
    }

    async getInvoiceActiveSupplier(idSupplier: number){
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchaseActiveSupplier${idSupplier}`
            )
        );
    }

    async getInvoiceByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchaseByDate/${from}/${to}`
            )
        );
    }

    async getInvoiceById(id: number) {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchaseById/${id}`
            )
        );
    }

    async addInvoice(entry: DocumentModel) {
        return await firstValueFrom(
            this.http.post<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/AddInvoicePurchase`,
                entry
            )
        );
    }

    async updateInvoice(entry: DocumentModel) {
        return await firstValueFrom(
            this.http.put<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/UpdateInvoicePurchase`,
                entry
            )
        );
    }

    async cancelInvoice(entry: number) {
        return await firstValueFrom(
            this.http.put<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/CanceledInvoicePurchase${entry}`,
                entry
            )
        );
    }
}
