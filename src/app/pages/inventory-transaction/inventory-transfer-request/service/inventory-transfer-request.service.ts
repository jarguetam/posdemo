import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { InventoryRequestTransfer } from '../models/inventory-request-transfer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferRequestService {

    constructor(private http: HttpClient) {}

    async get() {
        return await firstValueFrom(
            this.http.get<InventoryRequestTransfer[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryRequestTransfer`
            )
        );
    }

    async getToComplete() {
        return await firstValueFrom(
            this.http.get<InventoryRequestTransfer[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryRequestTransferToComplete`
            )
        );
    }

    async getByDate(from: string, to: string, userId: number) {
        return await firstValueFrom(
            this.http.get<InventoryRequestTransfer[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryRequestTransferByDate/${from}/${to}/${userId}`
            )
        );
    }

    async getById(id: number) {
        return await firstValueFrom(
            this.http.get<InventoryRequestTransfer[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryRequestTransferById/${id}`
            )
        );
    }

    async add(entry: InventoryRequestTransfer) {
        return await firstValueFrom(
            this.http.post<InventoryRequestTransfer[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryRequestTransfer`,
                entry
            )
        );
    }
}
