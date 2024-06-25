import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryReturnModel } from '../models/inventory-return-model';
import { InventoryReturnDetailModel } from '../models/inventory-return-detail';
import { DbLocalService } from 'src/app/service/db-local.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryReturnService {


    constructor(private http: HttpClient, private db: DbLocalService) {}

    async getByDate(from: string, to: string) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<InventoryReturnModel[]>(
                        `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryReturn/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) =>
                            throwError(() => 'Error en la solicitud HTTP')
                        ),
                        timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            const returnInventory = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(resolve, 5000)),
            ])) as InventoryReturnModel[];

            let returnOffline = await this.db.inventoryReturn.toArray();

            let combinedInvoices = [...returnOffline, ...returnInventory];
            return combinedInvoices;
        } catch (error) {
            let returnOffline = await this.db.inventoryReturn.toArray();
            return returnOffline;
        }
    }

    async getInventoryReturnResumen(date: string, whsCode: number) {
        return await firstValueFrom(
            this.http.get<InventoryReturnDetailModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryReturnResumen/${date}/${whsCode}`
            )
        );
    }

    async add(entry: InventoryReturnModel) {
        return await firstValueFrom(
            this.http.post<InventoryReturnModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddInventoryReturn`,
                entry
            )
        );
    }

    async edit(newReturn: InventoryReturnModel) {
        return await firstValueFrom(
            this.http.put<InventoryReturnModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/UpdateInventoryReturn`,
                newReturn
            )
        );
    }
    async complete(newReturn: InventoryReturnModel) {
        return await firstValueFrom(
            this.http.put<InventoryReturnModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/CompleteInventoryReturn`,
                newReturn
            )
        );
    }
}
