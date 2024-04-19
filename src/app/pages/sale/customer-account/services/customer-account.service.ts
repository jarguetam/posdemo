import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerAccountModel } from '../models/customer-account-model';

@Injectable({
  providedIn: 'root'
})
export class CustomerAccountService {

    constructor(private http: HttpClient) {}

    async getAccountCustomer() {
        return await firstValueFrom(
            this.http.get<CustomerAccountModel[]>(
                `${environment.uriLogistic}/api/Sales/GetCustomerAccountBalance`
            )
        );
    }
}
