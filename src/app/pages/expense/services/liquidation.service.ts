import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LiquidationModel } from '../models/liquidation-model';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { LiquidationDetailModel } from '../models/liquidation-detail-model';
import { LiquidationViewModel } from '../models/liquidation-view-model';
import { MoneyBillsModel } from '../models/money-model';
import { MoneyLiquidationModel } from '../models/money-liquidation-model';
import { LiquidationResumModel } from '../models/liquidation-resum';


@Injectable({
  providedIn: 'root'
})
export class LiquidationService {

    constructor(private http: HttpClient) {}

    async getMoneyBills() {
        return await firstValueFrom(
            this.http.get<MoneyBillsModel[]>(
                `${environment.uriLogistic}/api/Liquidation/GetMoneyBill`
            )
        );
    }

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

    async addLiquidationMoney(request) {
        return await firstValueFrom(
            this.http.post<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/AddMoneyLiquidation`,
                request
            )
        );
    }
    async editLiquidationMoney(request) {
        return await firstValueFrom(
            this.http.post<LiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/EditMoneyLiquidation`,
                request
            )
        );
    }

    async getMoneyLiquidationByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<MoneyLiquidationModel[]>(
                `${environment.uriLogistic}/api/Liquidation/GetLiquidationMoney/${from}/${to}`
            )
        );
    }

    async getLiquidationResum(sellerId: number, date: Date) {
        return await firstValueFrom(
            this.http.get<LiquidationResumModel>(
                `${environment.uriLogistic}/api/Liquidation/GetLiquidationSellerResum/${sellerId}/${date}`
            )
        );
    }
}
