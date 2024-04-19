import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CostRevaluationModel } from '../models/cost-revaluation-model';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostRevaluationService {

    constructor(private http: HttpClient) {}

    async getByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<CostRevaluationModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/GetCostRevaluationByDate/${from}/${to}`
            )
        );
    }


    async add(entry: CostRevaluationModel[]) {
        return await firstValueFrom(
            this.http.post<CostRevaluationModel[]>(
                `${environment.uriLogistic}/api/InventoryTransaction/AddCostRevaluation`,
                entry
            )
        );
    }
}
