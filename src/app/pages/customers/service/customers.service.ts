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

@Injectable({
    providedIn: 'root',
})
export class CustomersService {
    constructor(private http: HttpClient, private db: DbLocalService) {}

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

    async getCustomerActive() {
        try {
            const apiDataPromise = firstValueFrom(
                this.http.get<CustomerModel[]>(`${environment.uriLogistic}/api/Customers/CustomerActive`).pipe(
                    catchError((error) => throwError(() => error)),
                    timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                )
            );
            const customers = await Promise.race([
                apiDataPromise,
                new Promise(resolve => setTimeout(resolve, 3000))
            ]) as CustomerModel[];
            this.db.customers.clear();
            customers.map(customer => this.db.customers.add(customer));
            return customers;
        } catch (error) {
            const customersOffline = await this.db.customers.toArray();
            return customersOffline;
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
}
