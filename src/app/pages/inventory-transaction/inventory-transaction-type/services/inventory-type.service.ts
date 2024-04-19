import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryTransactionTypeModel } from '../model/inventory-type-model';

@Injectable({
    providedIn: 'root',
})
export class InventoryTypeService {
    constructor(private http: HttpClient) {}

    async getInventoryTransactionType() {
        return await firstValueFrom(
            this.http.get<InventoryTransactionTypeModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/InventoryTransactionType`
            )
        );
    }

    async getInventoryTransactionTypeBy(type: string) {
        return await firstValueFrom(
            this.http.get<InventoryTransactionTypeModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/InventoryTransactionTypeBy${type}`
            )
        );
    }

    async addInventoryTransactionType(request: InventoryTransactionTypeModel) {
        return await firstValueFrom(
            this.http.post<InventoryTransactionTypeModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryTransactionType`,
                request
            )
        );
    }

    async editInventoryTransactionType(request: InventoryTransactionTypeModel) {
        return await firstValueFrom(
            this.http.put<InventoryTransactionTypeModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/EditInventoryTransactionType`,
                request
            )
        );
    }
}
