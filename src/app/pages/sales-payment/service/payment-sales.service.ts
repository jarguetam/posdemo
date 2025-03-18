import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentSalesService {

    constructor(private http: HttpClient, private db: DbLocalService,private connectionStateService: ConnectionStateService) {}

    async getPaymentSales() {
        return await firstValueFrom(
            this.http.get<PaymentSaleModel[]>(
                `${environment.uriLogistic}/api/SalesPayment/GetPaymentSales`
            )
        );
    }

    private async getOfflinePayments(): Promise<PaymentSaleModel[]> {
        const paymentsOffline = await this.db.payment.toArray();
        return paymentsOffline;
    }

    async getPaymentSalesByDate(from: string, to: string): Promise<PaymentSaleModel[]> {
        // Obtenemos primero los datos offline
        const offlinePayments = await this.getOfflinePayments();
        console.log('Offline payments found:', offlinePayments.length);

        // Si estamos en modo offline forzado o sin conexión, usar solo datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline payment data due to offline mode');
            return offlinePayments;
        }

        try {
            const onlinePayments = await firstValueFrom(
                this.http
                    .get<PaymentSaleModel[]>(
                        `${environment.uriLogistic}/api/SalesPayment/GetPaymentSalesByDate/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching payments by date:', error);
                            return throwError(() => 'Error en la solicitud HTTP');
                        }),
                        timeout(10000)
                    )
            );

            console.log('Online payments found:', onlinePayments?.length || 0);

            // Verificar que tenemos datos válidos antes de combinar
            if (!onlinePayments || onlinePayments.length === 0) {
                console.warn('No online payments received, returning offline data');
                return offlinePayments;
            }

            // Combinar pagos asegurándonos que no son undefined
            const combinedPayments = [
                ...(offlinePayments || []),
                ...(onlinePayments || [])
            ];

            console.log('Combined payments before dedup:', combinedPayments.length);

            // Deduplicar usando UUID
            const uniquePayments = Array.from(
                new Map(
                    combinedPayments
                        .filter(payment => payment && payment.uuid) // Asegurarse que el pago y el UUID existen
                        .map(payment => [payment.uuid, payment])
                ).values()
            );

            console.log('Final unique payments:', uniquePayments.length);

            // Log de algunos detalles para debugging
            uniquePayments.forEach((payment, index) => {
                console.log(`Payment ${index + 1}: UUID=${payment.uuid}, ID=${payment.id}`);
            });

            return uniquePayments;

        } catch (error) {
            console.warn('Fallback to offline payment data due to error:', error);
            return offlinePayments;
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
