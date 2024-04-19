import { BpJornalModel } from './../models/bpJornal-model';
import { TypeDocument } from './../models/type-document';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanyInfo } from '../models/company-info';
import { FileToUpload } from '../models/file.to.upload';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { PayCondition } from '../models/paycondition';
import { Branch } from '../models/branch';
import { Correlative } from '../models/correlative-sar';
import { PointSale } from '../models/point-sale';
import { DbLocalService } from './db-local.service';

@Injectable()
export class CommonService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService) {}

    public companyInfo(): CompanyInfo {
        let company = localStorage.getItem('companyInfo');
        if (company == null) {
            return null;
        }
        return JSON.parse(company) as CompanyInfo;
    }

    async getCompanyInfo() {
        return await firstValueFrom(
            this.http.get<CompanyInfo[]>(
                `${environment.uriLogistic}/api/Common/GetCompanyInfo`
            )
        );
    }

    async getCompanyInfoAsync() {
        let company: CompanyInfo[] = await firstValueFrom(
            this.http.get<CompanyInfo[]>(
                `${environment.uriLogistic}/api/Common/GetCompanyInfo`
            )
        );
        const companyInfo = company[0];
        // Guarda la información de la empresa en localStorage
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
        // Guarda la imagen en localStorage (si existe)
        if (companyInfo.path) {
            await this.saveImageToLocalStorage(companyInfo.path, 'companyLogo');
        }
    }

    private async saveImageToLocalStorage(
        imageUrl: string,
        storageKey: string
    ): Promise<void> {
        let baseUrl =
            environment.uriLogistic +
            '/api/Common/DownloadFile?Path=' +
            imageUrl;

        const imageBlob = await firstValueFrom(
            this.http.get(baseUrl, { responseType: 'blob' })
        );
        // Convierte el blob a una cadena base64
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // Guarda la cadena base64 en localStorage
            localStorage.setItem(storageKey, base64data);
        };
    }

    async addCompanyInfo(modo: CompanyInfo) {
        return await firstValueFrom(
            this.http.post<CompanyInfo[]>(
                `${environment.uriLogistic}/api/Common/AddCompanyInfo`,
                modo
            )
        );
    }

    async editCompanyInfo(modo: CompanyInfo) {
        return await firstValueFrom(
            this.http.put<CompanyInfo[]>(
                `${environment.uriLogistic}/api/Common/EditCompanyInfo`,
                modo
            )
        );
    }

    async GetFileById(int: number) {
        return await firstValueFrom(
            this.http.get<FileToUpload>(
                `${environment.uriLogistic}/api/Common/FileInfo?id=` + int
            )
        );
    }

    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        return await firstValueFrom(
            this.http.post<FileToUpload>(
                `${environment.uriLogistic}/api/Common/UploadFile`,
                formData
            )
        );
    }

    async getPayCondition() {
        return await firstValueFrom(
            this.http.get<PayCondition[]>(
                `${environment.uriLogistic}/api/Common/PayCondition`
            )
        );
    }

    async getPayConditionActive() {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<PayCondition[]>(
                        `${environment.uriLogistic}/api/Common/PayConditionActive`
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(5000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            const payCondition = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(resolve, 10000)),
            ])) as PayCondition[];
            this.dbLocal.payCondition.clear();
            payCondition.map((pay) => this.dbLocal.payCondition.add(pay));
            return payCondition;
        } catch (error) {
            const payConditionOffline =
                await this.dbLocal.payCondition.toArray();
            return payConditionOffline as PayCondition[];
        }
    }

    async addPayCondition(request: PayCondition) {
        return await firstValueFrom(
            this.http.post<PayCondition[]>(
                `${environment.uriLogistic}/api/Common/AddPayCondition`,
                request
            )
        );
    }

    async editPayCondition(request: PayCondition) {
        return await firstValueFrom(
            this.http.put<PayCondition[]>(
                `${environment.uriLogistic}/api/Common/EditPayCondition`,
                request
            )
        );
    }
    //Numeracion SAR
    async getBranch() {
        return await firstValueFrom(
            this.http.get<Branch[]>(
                `${environment.uriLogistic}/api/Common/GetBranch`
            )
        );
    }

    async getTypeDocument() {
        return await firstValueFrom(
            this.http.get<TypeDocument[]>(
                `${environment.uriLogistic}/api/Common/GetTypeDocument`
            )
        );
    }

    async getPointSale() {
        return await firstValueFrom(
            this.http.get<PointSale[]>(
                `${environment.uriLogistic}/api/Common/GetPointSale`
            )
        );
    }
    async getPointSaleByUser() {
        return await firstValueFrom(
            this.http.get<PointSale[]>(
                `${environment.uriLogistic}/api/Common/GetPointSaleByUser`
            )
        );
    }
    async editPointSale(correlative: PointSale) {
        return await firstValueFrom(
            this.http.put<PointSale[]>(
                `${environment.uriLogistic}/api/Common/EditPointSale`,
                correlative
            )
        );
    }
    async addPointSale(correlative: PointSale) {
        return await firstValueFrom(
            this.http.post<PointSale[]>(
                `${environment.uriLogistic}/api/Common/AddPointSale`,
                correlative
            )
        );
    }

    async getCorrelative() {
        try {
            let correlative = await firstValueFrom(
                this.http
                    .get<Correlative[]>(
                        `${environment.uriLogistic}/api/Common/GetCorrelative`
                    )
                    .pipe(
                        catchError((error) => {
                            return throwError(() => error);
                        })
                    )
            );
            this.dbLocal.correlative.clear();
            correlative.map((pay) => this.dbLocal.correlative.add(pay));
            return correlative;
        } catch (error) {
            let correlativeOffline = await this.dbLocal.correlative.toArray();
            return correlativeOffline;
        }
    }

    async getCorrelativeInvoice() {
        try {
            let correlative = await firstValueFrom(
                this.http
                    .get<Correlative[]>(
                        `${environment.uriLogistic}/api/Common/GetCorrelativeInvoice`
                    )
                    .pipe(
                        catchError((error) => {
                            return throwError(() => error);
                        })
                    )
            );
            this.dbLocal.correlative.clear();
            correlative.map((pay) => this.dbLocal.correlative.add(pay));
            return correlative;
        } catch (error) {
            let correlativeOffline = await this.dbLocal.correlative.toArray();
            return correlativeOffline;
        }
    }

    async getCorrelativeInvoiceById(id: number) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<Correlative[]>(
                        `${environment.uriLogistic}/api/Common/GetCorrelativeInvoiceById${id}`
                    )
                    .pipe(
                        catchError((error) => throwError(() => error)),
                        timeout(3000) // Espera máximo 5 segundos para la respuesta de la API
                    )
            );
            const correlative = (await Promise.race([
                apiDataPromise,
                new Promise((resolve) => setTimeout(resolve, 3000)),
            ])) as Correlative[];
            this.dbLocal.correlative.clear();
            correlative.map((pay) => this.dbLocal.correlative.add(pay));
            return correlative;
        } catch (error) {
            const correlativeOffline = await this.dbLocal.correlative.toArray();
            return correlativeOffline;
        }
    }

    async editCorrelative(correlative: Correlative) {
        return await firstValueFrom(
            this.http.put<Correlative[]>(
                `${environment.uriLogistic}/api/Common/EditCorrelative`,
                correlative
            )
        );
    }
    async addCorrelative(correlative: Correlative) {
        return await firstValueFrom(
            this.http.post<Correlative[]>(
                `${environment.uriLogistic}/api/Common/AddCorrelative`,
                correlative
            )
        );
    }

    async getJornalBp(bpId: number, type: string) {
        return await firstValueFrom(
            this.http.get<BpJornalModel[]>(
                `${environment.uriLogistic}/api/Common/GetJornalBp${bpId}/${type}`
            )
        );
    }
}
