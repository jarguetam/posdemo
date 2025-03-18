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
import { ConnectionStateService } from './connection-state.service';

@Injectable()
export class CommonService {
    constructor(private http: HttpClient, private dbLocal: DbLocalService, private connectionStateService: ConnectionStateService) {}

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

    private async getOfflinePayConditions(): Promise<PayCondition[]> {
        const payConditionOffline = await this.dbLocal.payCondition.toArray();
        return payConditionOffline as PayCondition[];
    }

    async getPayConditionActive(): Promise<PayCondition[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline pay condition data due to offline mode');
            return this.getOfflinePayConditions();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<PayCondition[]>(
                        `${environment.uriLogistic}/api/Common/PayConditionActive`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching pay conditions:', error);
                            return throwError(() => error);
                        }),
                        timeout(5000)
                    )
            );

            const payCondition = await Promise.race([
                apiDataPromise,
                new Promise<PayCondition[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 10 seconds');
                        resolve([]);
                    }, 10000)
                )
            ]);

            // Si no hay datos o están vacíos
            if (!payCondition || payCondition.length === 0) {
                throw new Error('No pay condition data received or timeout occurred');
            }

            // Actualizar la base de datos local
            try {
                await this.dbLocal.payCondition.clear();
                await Promise.all(
                    payCondition.map(pay => this.dbLocal.payCondition.add(pay))
                );
                console.log('Successfully updated local pay condition database');
            } catch (dbError) {
                console.error('Error updating local pay condition database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return payCondition;

        } catch (error) {
            console.warn('Fallback to offline pay condition data due to error:', error);
            return this.getOfflinePayConditions();
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

    private async getOfflineCorrelatives(): Promise<Correlative[]> {
        const correlativeOffline = await this.dbLocal.correlative.toArray();
        return correlativeOffline;
    }

    async getCorrelativeInvoiceById(id: number): Promise<Correlative[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline correlative data due to offline mode');
            return this.getOfflineCorrelatives();
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<Correlative[]>(
                        `${environment.uriLogistic}/api/Common/GetCorrelativeInvoiceById${id}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching correlatives:', error);
                            return throwError(() => error);
                        }),
                        timeout(3000)
                    )
            );

            const correlative = await Promise.race([
                apiDataPromise,
                new Promise<Correlative[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 3 seconds');
                        resolve([]);
                    }, 3000)
                )
            ]);

            // Verificar si hay datos válidos
            if (!correlative || correlative.length === 0) {
                throw new Error('No correlative data received or timeout occurred');
            }

            // Actualizar la base de datos local
            try {
                await this.dbLocal.correlative.clear();
                await Promise.all(
                    correlative.map(corr => this.dbLocal.correlative.add(corr))
                );
                console.log('Successfully updated local correlative database');
            } catch (dbError) {
                console.error('Error updating local correlative database:', dbError);
                // No interrumpimos el flujo principal si falla la actualización local
            }

            return correlative;

        } catch (error) {
            console.warn('Fallback to offline correlative data due to error:', error);
            return this.getOfflineCorrelatives();
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
