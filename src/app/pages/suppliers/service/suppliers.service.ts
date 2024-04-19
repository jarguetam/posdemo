import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupplierCategoryModel } from '../models/category-supplier';
import { SupplierModel } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

    constructor(private http: HttpClient) {}

    async getSupplierCategory() {
        return await firstValueFrom(
            this.http.get<SupplierCategoryModel[]>(
                `${environment.uriLogistic}/api/Supplier/SupplierCategory`
            )
        );
    }

    async getSupplierCategoryActive() {
        return await firstValueFrom(
            this.http.get<SupplierCategoryModel[]>(
                `${environment.uriLogistic}/api/Supplier/SupplierCategoryActive`
            )
        );
    }

    async addSupplierCategory(request: SupplierCategoryModel) {
        return await firstValueFrom(
            this.http.post<SupplierCategoryModel[]>(
                `${environment.uriLogistic}/api/Supplier/AddSupplierCategory`,
                request
            )
        );
    }

    async editSupplierCategory(request: SupplierCategoryModel) {
        return await firstValueFrom(
            this.http.put<SupplierCategoryModel[]>(
                `${environment.uriLogistic}/api/Supplier/EditSupplierCategory`,
                request
            )
        );
    }
    //Supplier
    async getSupplier() {
        return await firstValueFrom(
            this.http.get<SupplierModel[]>(
                `${environment.uriLogistic}/api/Supplier/Supplier`
            )
        );
    }

    async getSupplierActive() {
        return await firstValueFrom(
            this.http.get<SupplierModel[]>(
                `${environment.uriLogistic}/api/Supplier/SupplierActive`
            )
        );
    }

    async addSupplier(request: SupplierModel) {
        return await firstValueFrom(
            this.http.post<SupplierModel[]>(
                `${environment.uriLogistic}/api/Supplier/AddSupplier`,
                request
            )
        );
    }

    async editSupplier(request: SupplierModel) {
        return await firstValueFrom(
            this.http.put<SupplierModel[]>(
                `${environment.uriLogistic}/api/Supplier/EditSupplier`,
                request
            )
        );
    }
}
