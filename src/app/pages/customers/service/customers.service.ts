import { PriceSpecialCustomerModel } from './../models/price-special-customer';
import { PriceListDetailModel } from './../models/pricelist-detail';
import { CustomerCategoryModel } from '../models/category';
import { environment } from 'src/environments/environment';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PriceListModel } from '../models/pricelist';
import { CustomerModel } from '../models/customer';
import { ItemPriceCustomerModel } from '../models/item-price-customer';
import { DbLocalService } from 'src/app/service/db-local.service';
import { FrequencyModel } from '../models/frequency-model';
import { ZoneModel } from '../models/zone-model';
import { CustomerBalanceModel } from '../models/customer-balance-model';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class CustomersService {
    constructor(private http: HttpClient, private db: DbLocalService,private connectionStateService: ConnectionStateService) {}

    async getCustomerCategory() {
        return await firstValueFrom(
            this.http.get<CustomerCategoryModel[]>(
                `${environment.uriLogistic}/api/Customers/CustomerCategory`
            )
        );
    }

    async getCustomerCategoryActive() {
        return await firstValueFrom(
            this.http.get<CustomerCategoryModel[]>(
                `${environment.uriLogistic}/api/Customers/CustomerCategoryActive`
            )
        );
    }

    async addCustomerCategory(request: CustomerCategoryModel) {
        return await firstValueFrom(
            this.http.post<CustomerCategoryModel[]>(
                `${environment.uriLogistic}/api/Customers/AddCustomerCategory`,
                request
            )
        );
    }

    async editCustomerCategory(request: CustomerCategoryModel) {
        return await firstValueFrom(
            this.http.put<CustomerCategoryModel[]>(
                `${environment.uriLogistic}/api/Customers/EditCustomerCategory`,
                request
            )
        );
    }

    async getPriceList() {
        return await firstValueFrom(
            this.http.get<PriceListModel[]>(
                `${environment.uriLogistic}/api/Customers/PriceList`
            )
        );
    }

    async getPriceListActive() {
        return await firstValueFrom(
            this.http.get<PriceListModel[]>(
                `${environment.uriLogistic}/api/Customers/PriceListActive`
            )
        );
    }

    async addPriceList(request: PriceListModel) {
        return await firstValueFrom(
            this.http.post<PriceListModel[]>(
                `${environment.uriLogistic}/api/Customers/AddPriceList`,
                request
            )
        );
    }

    async editPriceList(request: PriceListModel) {
        return await firstValueFrom(
            this.http.put<PriceListModel[]>(
                `${environment.uriLogistic}/api/Customers/EditPriceList`,
                request
            )
        );
    }

    async getPriceListDetail(priceId: number) {
        return await firstValueFrom(
            this.http.get<PriceListDetailModel[]>(
                `${environment.uriLogistic}/api/Customers/PriceListDetail?idPriceList=` +
                    priceId
            )
        );
    }

    async getPriceSpecialCustomerDetail(priceId: number, customerId: number) {
        return await firstValueFrom(
            this.http.get<PriceListDetailModel[]>(
                `${environment.uriLogistic}/api/Customers/PriceSpecialCustomerDetail${priceId}/${customerId}`
            )
        );
    }

    async getItemPriceCustomer(priceId: number, customerId: number) {
        return await firstValueFrom(
            this.http.get<ItemPriceCustomerModel[]>(
                `${environment.uriLogistic}/api/Customers/ItemPriceCustomer${priceId}/${customerId}`
            )
        );
    }

    async editPriceListDetail(request: PriceListDetailModel[]) {
        return await firstValueFrom(
            this.http.put<PriceListDetailModel[]>(
                `${environment.uriLogistic}/api/Customers/UpdatePriceListDetail`,
                request
            )
        );
    }

    async addSpecialPriceCustomer(request: PriceSpecialCustomerModel[]) {
        return await firstValueFrom(
            this.http.post<String[]>(
                `${environment.uriLogistic}/api/Customers/AddSpecialPriceCustomer`,
                request
            )
        );
    }

    //Customers
    async getCustomer() {
        return await firstValueFrom(
            this.http.get<CustomerModel[]>(
                `${environment.uriLogistic}/api/Customers/Customer`
            )
        );
    }

    private async getOfflineCustomers(): Promise<CustomerModel[]> {
        const customersOffline = await this.db.customers.toArray();
        return customersOffline;
    }

    async getCustomerActive(): Promise<CustomerModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline customer data due to offline mode');
            return this.getOfflineCustomers();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<CustomerModel[]>(
                        `${environment.uriLogistic}/api/Customers/CustomerActive`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching customers:', error);
                            return throwError(() => error);
                        }),
                        timeout(10000)
                    )
            );

            const customers = await Promise.race([
                apiDataPromise,
                new Promise<CustomerModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 8 seconds');
                        resolve([]);
                    }, 8000)
                )
            ]);

            // Si no hay datos o están vacíos
            if (!customers || customers.length === 0) {
                throw new Error('No customer data received or timeout occurred');
            }

            // Actualizar la base de datos local
            try {
                await this.db.customers.clear();
                await Promise.all(
                    customers.map(customer => this.db.customers.add(customer))
                );
                console.log('Successfully updated local customer database');
            } catch (dbError) {
                console.error('Error updating local customer database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return customers;

        } catch (error) {
            console.warn('Fallback to offline customer data due to error:', error);
            return this.getOfflineCustomers();
        }
    }


    async addCustomer(request: CustomerModel) {
        return await firstValueFrom(
            this.http.post<CustomerModel[]>(
                `${environment.uriLogistic}/api/Customers/AddCustomer`,
                request
            )
        );
    }

    async editCustomer(request: CustomerModel) {
        return await firstValueFrom(
            this.http.put<CustomerModel[]>(
                `${environment.uriLogistic}/api/Customers/EditCustomer`,
                request
            )
        );
    }


    async getFrequency() {
        return await firstValueFrom(
            this.http.get<FrequencyModel[]>(
                `${environment.uriLogistic}/api/Customers/CustomerFrequency`
            )
        );
    }

    async getZone() {
        return await firstValueFrom(
            this.http.get<ZoneModel[]>(
                `${environment.uriLogistic}/api/Customers/CustomerZone`
            )
        );
    }

    async getCustomerBalance(bpId: number, from: Date, to: Date) {
        return await firstValueFrom(
            this.http.get<CustomerBalanceModel[]>(
                `${environment.uriLogistic}/api/Common/GetCustomerJournal${bpId}/${from}/${to}`
            )
        );
    }
}
