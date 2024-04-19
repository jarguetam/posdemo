import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashobarDataModel } from 'src/app/components/dashboard/models/dashboar-data-model';
import { DataDashBoard } from 'src/app/components/dashboard/models/data-dashboard';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    constructor(private http: HttpClient) { }

    async getData(userId: number) {
        return await firstValueFrom(
            this.http.get<DashobarDataModel[]>(
                `${environment.uriLogistic}/api/Dashboard/GetDataDasboard${userId}`
            )
        );
    }

}
