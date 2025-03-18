import { SellerModel } from './../models/seller';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SellerRegion } from '../models/seller-region';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class SellerService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService,private connectionStateService: ConnectionStateService) {}

    async getSellerRegion() {
        return await firstValueFrom(
            this.http.get<SellerRegion[]>(
                `${environment.uriLogistic}/api/Sellers/SellerRegion`
            )
        );
    }

    async getSellerRegionActive() {
        return await firstValueFrom(
            this.http.get<SellerRegion[]>(
                `${environment.uriLogistic}/api/Sellers/SellerRegionActive`
            )
        );
    }

    async addSellerRegion(request: SellerRegion) {
        return await firstValueFrom(
            this.http.post<SellerRegion[]>(
                `${environment.uriLogistic}/api/Sellers/AddSellerRegion`,
                request
            )
        );
    }

    async editSellerRegion(request: SellerRegion) {
        return await firstValueFrom(
            this.http.put<SellerRegion[]>(
                `${environment.uriLogistic}/api/Sellers/EditSellerRegion`,
                request
            )
        );
    }

    private async getOfflineSellers(): Promise<SellerModel[]> {
        const sellerOffline = await this.dbLocal.seller.toArray();
        return sellerOffline;
    }

    async getSeller(): Promise<SellerModel[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline seller data due to offline mode');
            return this.getOfflineSellers();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<SellerModel[]>(`${environment.uriLogistic}/api/Sellers/Seller`)
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching sellers:', error);
                            return throwError(() => error);
                        }),
                        timeout(5000)
                    )
            );

            const seller = await Promise.race([
                apiDataPromise,
                new Promise<SellerModel[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 10 seconds');
                        resolve([]);
                    }, 10000)
                )
            ]);

            // Verificar si hay datos válidos
            if (!seller || seller.length === 0) {
                throw new Error('No seller data received or timeout occurred');
            }

            // Actualizar la base de datos local
            try {
                await this.dbLocal.seller.clear();
                await Promise.all(
                    seller.map(sellerItem => this.dbLocal.seller.add(sellerItem))
                );
                console.log('Successfully updated local seller database');
            } catch (dbError) {
                console.error('Error updating local seller database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return seller;

        } catch (error) {
            console.warn('Fallback to offline seller data due to error:', error);
            return this.getOfflineSellers();
        }
    }

    async addSeller(request: SellerModel) {
        return await firstValueFrom(
            this.http.post<SellerModel[]>(
                `${environment.uriLogistic}/api/Sellers/AddSeller`,
                request
            )
        );
    }

    async editSeller(request: SellerModel) {
        return await firstValueFrom(
            this.http.put<SellerModel[]>(
                `${environment.uriLogistic}/api/Sellers/EditSeller`,
                request
            )
        );
    }
}
