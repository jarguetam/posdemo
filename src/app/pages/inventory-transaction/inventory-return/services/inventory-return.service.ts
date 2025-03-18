import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryReturnModel } from '../models/inventory-return-model';
import { InventoryReturnDetailModel } from '../models/inventory-return-detail';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryReturnService {


    constructor(private http: HttpClient, private db: DbLocalService,private connectionStateService: ConnectionStateService) {}

    private async getOfflineReturns(): Promise<InventoryReturnModel[]> {
        const returnOffline = await this.db.inventoryReturn.toArray();
        return returnOffline;
    }

    async getByDate(from: string, to: string): Promise<InventoryReturnModel[]> {
        // Obtenemos primero los datos offline
        const offlineReturns = await this.getOfflineReturns();
        console.log('Offline returns found:', offlineReturns.length);

        // Si estamos en modo offline forzado o sin conexión, usar solo datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline inventory return data due to offline mode');
            return offlineReturns;
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<InventoryReturnModel[]>(
                        `${environment.uriLogistic}/api/InventoryTransaction/GetInventoryReturn/${from}/${to}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching inventory returns:', error);
                            return throwError(() => 'Error en la solicitud HTTP');
                        }),
                        timeout(5000)
                    )
            );

            const onlineReturns = await Promise.race([
                apiDataPromise,
                new Promise<InventoryReturnModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 5 seconds');
                        resolve([]);
                    }, 5000)
                )
            ]);

            console.log('Online returns found:', onlineReturns?.length || 0);

            // Verificar que tenemos datos válidos antes de combinar
            if (!onlineReturns || onlineReturns.length === 0) {
                console.warn('No online returns received, returning offline data');
                return offlineReturns;
            }

            // Combinar devoluciones asegurándonos que no son undefined
            const combinedReturns = [
                ...(offlineReturns || []),
                ...(onlineReturns || [])
            ];

            console.log('Combined returns before dedup:', combinedReturns.length);

            // Deduplicar usando idOffline o un identificador único
            const uniqueReturns = Array.from(
                new Map(
                    combinedReturns
                        .filter(ret => ret && (ret.idOffline || ret.id)) // Asegurarse que la devolución tiene un identificador
                        .map(ret => [(ret.idOffline || ret.id), ret])
                ).values()
            );

            console.log('Final unique returns:', uniqueReturns.length);

            // Log de algunos detalles para debugging
            uniqueReturns.forEach((ret, index) => {
                console.log(`Return ${index + 1}: ID=${ret.id}, OfflineID=${ret.idOffline}`);
            });

            return uniqueReturns;

        } catch (error) {
            console.warn('Fallback to offline inventory return data due to error:', error);
            return offlineReturns;
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
