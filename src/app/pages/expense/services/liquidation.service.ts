import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LiquidationModel } from '../models/liquidation-model';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { LiquidationDetailModel } from '../models/liquidation-detail-model';
import { LiquidationViewModel } from '../models/liquidation-view-model';


@Injectable({
  providedIn: 'root'
})
export class LiquidationService {

    constructor(private http: HttpClient) {}

    async getLiquidationByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/GetLiquidationByDate/${from}/${to}`
            )
        );
    }

    async getLiquidationDetail(from: string, to: string, sellerId: number) {
        return await firstValueFrom(
            this.http.get<LiquidationViewModel[]>(
                `${environment.uriLogistic}/api/Liquidation/GetliquidationDetail/${from}/${to}/${sellerId}`
            )
        );
    }

    async addLiquidation(request: LiquidationModel) {
        return await firstValueFrom(
            this.http.post<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/AddLiquidation`,
                request
            )
        );
    }

    async editLiquidation(request: LiquidationModel) {
        return await firstValueFrom(
            this.http.put<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/UpdateLiquidation`,
                request
            )
        );
    }

    async cancelLiquidation(request: LiquidationModel) {
        return await firstValueFrom(
            this.http.put<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/CancelLiquidation`,
                request
            )
        );
    }
}
