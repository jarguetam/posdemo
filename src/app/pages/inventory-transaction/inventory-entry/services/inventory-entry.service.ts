import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { InventoryEntryModel } from '../models/inventory-entry';

@Injectable({
    providedIn: 'root',
})
export class InventoryEntryService {
    constructor(private http: HttpClient) {}

    async get() {
        return await firstValueFrom(
            this.http.get<InventoryEntryModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryEntry`
            )
        );
    }

    async getByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<InventoryEntryModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryEntryByDate/${from}/${to}`
            )
        );
    }

    async getById(id: number) {
        return await firstValueFrom(
            this.http.get<InventoryEntryModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryEntryById/${id}`
            )
        );
    }

    async add(entry: InventoryEntryModel) {
        return await firstValueFrom(
            this.http.post<InventoryEntryModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryEntry`,
                entry
            )
        );
    }
}
