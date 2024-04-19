import { SellerModel } from './../models/seller';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SellerRegion } from '../models/seller-region';
import { DbLocalService } from 'src/app/service/db-local.service';

@Injectable({
    providedIn: 'root',
})
export class SellerService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService) {}

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

    async getSeller() {
        try {
            const apiDataPromise = firstValueFrom(
                this.http.get<SellerModel[]>(`${environment.uriLogistic}/api/Sellers/Seller`).pipe(
                    catchError((error) => throwError(() => error)),
                    timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                )
            );
            const seller = await Promise.race([
                apiDataPromise,
                new Promise(resolve => setTimeout(resolve, 10000))
            ]) as SellerModel[];
            this.dbLocal.seller.clear();
            seller.map(pay => this.dbLocal.seller.add(pay));
            return seller;
        } catch (error) {
            const sellerOffline = await this.dbLocal.seller.toArray();
            return sellerOffline;
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
