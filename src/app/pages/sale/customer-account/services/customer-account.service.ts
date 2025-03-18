import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerAccountModel } from '../models/customer-account-model';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class CustomerAccountService {
    constructor(private http: HttpClient,private db: DbLocalService,private connectionStateService: ConnectionStateService) {}

    private async getOfflineCustomerAccounts(): Promise<CustomerAccountModel[]> {
        const customersOffline = await this.db.customerAccountModel.toArray();
        return customersOffline;
    }

    async getAccountCustomer(): Promise<CustomerAccountModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline customer account data due to offline mode');
            return this.getOfflineCustomerAccounts();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<CustomerAccountModel[]>(
                        `${environment.uriLogistic}/api/Sales/GetCustomerAccountBalance`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching customer accounts:', error);
                            return throwError(() => error);
                        }),
                        timeout(10000)
                    )
            );

            const customers = await Promise.race([
                apiDataPromise,
                new Promise<CustomerAccountModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 8 seconds');
                        resolve([]);
                    }, 8000)
                )
            ]);

            // Verificar si hay datos válidos
            if (!customers || customers.length === 0) {
                console.warn('No customer account data received or timeout occurred');
                throw new Error('API request timed out or returned no data');
            }

            // Actualizar la base de datos local
            try {
                await this.db.customerAccountModel.clear();
                await this.db.customerAccountModel.bulkAdd(customers);
                console.log('Successfully updated local customer account database');
            } catch (dbError) {
                console.error('Error updating local customer account database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return customers;

        } catch (error) {
            console.warn('Fallback to offline customer account data due to error:', error);
            return this.getOfflineCustomerAccounts();
        }
    }
}
