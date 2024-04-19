import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WareHouseModel } from '../models/warehouse';
import { DbLocalService } from 'src/app/service/db-local.service';

@Injectable({
    providedIn: 'root',
})
export class ServiceWareHouseService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService) {}

    async getWarehouse() {
        return await firstValueFrom(
            this.http.get<WareHouseModel[]>(
                `${environment.uriLogistic}/api/WareHouse`
            )
        );
    }

    async getWarehouseActive() {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<WareHouseModel[]>(
                        `${environment.uriLogistic}/api/WareHouse/WareHouseActive`
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(3000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            const warehouseData = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(resolve, 3000)),
            ])) as WareHouseModel[];
            this.dbLocal.wareHouse.clear();
            warehouseData.map((pay) => this.dbLocal.wareHouse.add(pay));
            return warehouseData;
        } catch (error) {
            const warehouseOffline = await this.dbLocal.wareHouse.toArray();
            return warehouseOffline as WareHouseModel[];
        }
    }

    async addWarehouse(request: WareHouseModel) {
        return await firstValueFrom(
            this.http.post<WareHouseModel[]>(
                `${environment.uriLogistic}/api/WareHouse`,
                request
            )
        );
    }
    async editWarehouse(request: WareHouseModel) {
        return await firstValueFrom(
            this.http.put<WareHouseModel[]>(
                `${environment.uriLogistic}/api/WareHouse`,
                request
            )
        );
    }
}
