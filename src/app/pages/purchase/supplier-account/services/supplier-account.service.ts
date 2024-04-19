import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupplierAccountModel } from '../models/supplier-account-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierAccountService {

    constructor(private http: HttpClient) {}

    async getAccountSupplier() {
        return await firstValueFrom(
            this.http.get<SupplierAccountModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetSupplierAccountBalance`
            )
        );
    }
}
