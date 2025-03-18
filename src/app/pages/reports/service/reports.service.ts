import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryReportModel } from '../models/inventory-report-model';
import { DocumentModel } from '../../purchase/models/document';
import { ReportsModel } from '../models/report-model';

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

    getReportSalesPdf(from: string, to: string): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetSalesReport${from}/${to}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getReportSalesMargenPdf(from: string, to: string,sellerId: number): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetReportMargen${from}/${to}/${sellerId}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getReportExpensePdf(from: string, to: string,sellerId: number): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetReportExpense${from}/${to}/${sellerId}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getReportCxCPdf(sellerId: number, onlyOverDue: boolean): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetCXCReport${sellerId}/${onlyOverDue}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getReportInventoryPdf(whsCode: number): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/Reports/GetReportInventoryCategory${whsCode}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getReportView(type: string): Observable<Blob> {
        const url = `${environment.uriLogistic}/api/DataGeneric/type`;
        return this.http.get(url, { responseType: 'blob' });
    }

    async getReportList() {
        return await firstValueFrom(
            this.http.get<ReportsModel[]>(
                `${environment.uriLogistic}/api/DataGeneric/GetReports`
            )
        );
    }

    async getDataFromView(vista: string): Promise<any> {
        return await firstValueFrom(
            this.http.get(
                `${environment.uriLogistic}/api/DataGeneric/vista?vista=${vista}`
            )
        );
    }
}
