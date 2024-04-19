import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentModel } from '../models/payment-model';

@Injectable({
    providedIn: 'root',
})
export class PaymentPurchaseService {
    constructor(private http: HttpClient) {}

    async getPaymentPurchase() {
        return await firstValueFrom(
            this.http.get<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/GetPaymentPurchase`
            )
        );
    }

    async getPaymentPurchaseByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/GetPaymentPurchaseByDate/${from}/${to}`
            )
        );
    }

    async getPaymentPurchaseById(id: number) {
        return await firstValueFrom(
            this.http.get<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/GetPaymentPurchaseById/${id}`
            )
        );
    }

    async addPaymentPurchase(entry: PaymentModel) {
        return await firstValueFrom(
            this.http.post<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/AddPaymentPurchase`,
                entry
            )
        );
    }

    async updatePaymentPurchase(entry: PaymentModel) {
        return await firstValueFrom(
            this.http.put<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/UpdatePaymentPurchase`,
                entry
            )
        );
    }

    async cancelPaymentPurchase(entry: number) {
        return await firstValueFrom(
            this.http.put<PaymentModel[]>(
                `${environment.uriLogistic}/api/PurchasePayment/CanceledPaymentPurchase${entry}`,
                entry
            )
        );
    }
}
