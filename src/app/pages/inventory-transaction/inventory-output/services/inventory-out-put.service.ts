import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryOutPutModel } from '../models/inventory-output';

@Injectable({
  providedIn: 'root'
})
export class InventoryOutPutService {

    constructor(private http: HttpClient) {}

    async get() {
        return await firstValueFrom(
            this.http.get<InventoryOutPutModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryOutPut`
            )
        );
    }

    async getByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<InventoryOutPutModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryOutPutByDate/${from}/${to}`
            )
        );
    }

    async getById(id: number) {
        return await firstValueFrom(
            this.http.get<InventoryOutPutModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryOutPutById/${id}`
            )
        );
    }

    async add(entry: InventoryOutPutModel) {
        return await firstValueFrom(
            this.http.post<InventoryOutPutModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryOutPut`,
                entry
            )
        );
    }
}
