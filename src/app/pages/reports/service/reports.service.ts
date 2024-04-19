import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryReportModel } from '../models/inventory-report-model';
import { DocumentModel } from '../../purchase/models/document';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(private http: HttpClient) {}

    async getInventoryReport() {
        return await firstValueFrom(
            this.http.get<InventoryReportModel[]>(
                `${environment.uriLogistic}/api/Reports/GetInventoryReport`
            )
        );
    }

    async getInventoryWarehouseReport() {
        return await firstValueFrom(
            this.http.get<InventoryReportModel[]>(
                `${environment.uriLogistic}/api/Reports/GetInventoryWareHouseReport`
            )
        );
    }

    async getPurchaseByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<DocumentModel[]>(
                `${environment.uriLogistic}/api/Purchases/GetInvoicePurchaseByDate/${from}/${to}`
            )
        );
    }

    getReportSalesPdf(from: Date, to: Date): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetSalesReport${from}/${to}`;
        return this.http.get(url, { responseType: 'blob' });
      }
}
