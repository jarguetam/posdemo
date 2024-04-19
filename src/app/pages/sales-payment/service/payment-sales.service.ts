import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { DbLocalService } from 'src/app/service/db-local.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentSalesService {

    constructor(private http: HttpClient, private db: DbLocalService) {}

    async getPaymentSales() {
        return await firstValueFrom(
            this.http.get<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/GetPaymentSales`
            )
        );
    }

    async getPaymentSalesByDate(from: string, to: string) {
        try {
            let payments = await firstValueFrom(
                this.http.get<PaymentSaleModel[]>(
                    `${environment.uriLogistic}/api/SalesPayment/GetPaymentSalesByDate/${from}/${to}`
                ).pipe(
                    catchError((error) => {
                        return throwError(()=>('Error en la solicitud HTTP'));
                    })
                )
            );
            let paymentsOffline = await this.db.payment.toArray();
            let combinedInvoices = [...paymentsOffline, ...payments];
            return combinedInvoices;
        } catch (error) {
            let paymentsOffline = await this.db.payment.toArray();
            return paymentsOffline;
        }
    }

    async getPaymentSalesById(id: number) {
        return await firstValueFrom(
            this.http.get<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/GetPaymentSalesById/${id}`
            )
        );
    }

    async addPaymentSales(entry: PaymentSaleModel) {
        return await firstValueFrom(
            this.http.post<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/AddPaymentSales`,
                entry
            )
        );
    }

    async updatePaymentSales(entry: PaymentSaleModel) {
        return await firstValueFrom(
            this.http.put<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/UpdatePaymentSales`,
                entry
            )
        );
    }

    async cancelPaymentSales(entry: number) {
        return await firstValueFrom(
            this.http.put<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/CanceledPaymentSales${entry}`,
                entry
            )
        );
    }
}
