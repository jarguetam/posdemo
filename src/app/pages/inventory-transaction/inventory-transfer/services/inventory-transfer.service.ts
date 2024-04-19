import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryTransferModel } from '../models/inventory-transfer';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferService {
    constructor(private http: HttpClient) {}

    async get() {
        return await firstValueFrom(
            this.http.get<InventoryTransferModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryTransfer`
            )
        );
    }

    async getByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<InventoryTransferModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryTransferByDate/${from}/${to}`
            )
        );
    }

    async getById(id: number) {
        return await firstValueFrom(
            this.http.get<InventoryTransferModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryTransferById/${id}`
            )
        );
    }

    async add(entry: InventoryTransferModel) {
        return await firstValueFrom(
            this.http.post<InventoryTransferModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryTransfer`,
                entry
            )
        );
    }
}
