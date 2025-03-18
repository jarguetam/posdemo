import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WareHouseModel } from '../models/warehouse';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class ServiceWareHouseService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService,
        private connectionStateService: ConnectionStateService
    ) {}

    private async getOfflineWarehouses(): Promise<WareHouseModel[]> {
        const warehouseOffline = await this.dbLocal.wareHouse.toArray();
        return warehouseOffline as WareHouseModel[];
    }

    async getWarehouseActive(): Promise<WareHouseModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline warehouse data due to offline mode');
            return this.getOfflineWarehouses();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<WareHouseModel[]>(
                        `${environment.uriLogistic}/api/WareHouse/WareHouseActive`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching warehouses:', error);
                            return throwError(() => error);
                        }),
                        timeout(3000)
                    )
            );

            const warehouseData = await Promise.race([
                apiDataPromise,
                new Promise<WareHouseModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 3 seconds');
                        resolve([]);
                    }, 3000)
                )
            ]);

            // Si no hay datos, posiblemente por timeout
            if (!warehouseData || warehouseData.length === 0) {
                throw new Error('No warehouse data received or timeout occurred');
            }

            // Actualizar la base de datos local
            try {
                await this.dbLocal.wareHouse.clear();
                await Promise.all(
                    warehouseData.map(warehouse =>
                        this.dbLocal.wareHouse.add(warehouse)
                    )
                );
                console.log('Successfully updated local warehouse database');
            } catch (dbError) {
                console.error('Error updating local warehouse database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return warehouseData;

        } catch (error) {
            console.warn('Fallback to offline warehouse data due to error:', error);
            return this.getOfflineWarehouses();
        }
    }
    async getWarehouse() {
        return await firstValueFrom(
            this.http.get<WareHouseModel[]>(
                `${environment.uriLogistic}/api/WareHouse`
            )
        );
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
