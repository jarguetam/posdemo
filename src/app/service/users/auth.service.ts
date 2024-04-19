import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    BehaviorSubject,
    firstValueFrom,
    Observable,
    of,
    throwError,
} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ConfigService } from '../app.config.service';
import { CommonService } from '../common.service';
import { CompanyInfo } from 'src/app/models/company-info';
import { DbLocalService } from '../db-local.service';
import { ConnectionState, ConnectionService } from 'ng-connection-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private currentCompanySubject: BehaviorSubject<CompanyInfo>;
    public currentCompany: Observable<CompanyInfo>;
    currentState: ConnectionState;
    status: boolean;

    constructor(
        private http: HttpClient,
        private router: Router,
        public configService: ConfigService,
        private commonService: CommonService,
        private db: DbLocalService,
        private connectionService: ConnectionService
    ) {
        const storedUser = sessionStorage.getItem('currentUser');
        const initialUser = storedUser ? JSON.parse(storedUser) : null;
        this.currentUserSubject = new BehaviorSubject<User>(initialUser);
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentCompanySubject = new BehaviorSubject<CompanyInfo>(
            JSON.parse(localStorage.getItem('companyInfo'))
        );
        this.currentCompany = this.currentCompanySubject.asObservable();
        this.connectionService
            .monitor()
            .pipe(
                tap((newState: ConnectionState) => {
                    this.currentState = newState;
                    if (this.currentState.hasNetworkConnection) {
                        this.status = true;
                    } else {
                        this.status = false;
                    }
                })
            )
            .subscribe();
    }

    public get UserValue(): User {
        return this.currentUserSubject.value;
    }

    public get CompanyValue(): CompanyInfo {
        return this.currentCompanySubject.value;
    }

    public hasPermission(code: string): boolean {
        let hasPermission = this.UserValue.permissions.filter(
            (item) => item.path == code
        );
        return hasPermission.length > 0;
    }

    async loginOnline(
        userName: string,
        password: string
    ): Promise<Observable<any>> {
        return this.http
            .post<any>(`${environment.uriLogistic}/auth`, {
                userName,
                password,
            })
            .pipe(
                map((user) => {
                    if (user && user.token) {
                        let isDark = user.theme.toLowerCase().includes('dark');
                        this.changeTheme(user.theme, isDark);
                        sessionStorage.setItem(
                            'currentUser',
                            JSON.stringify(user)
                        );
                        this.db.user.clear();
                        this.db.user.add(user);
                        this.getCompanyInfoAsync();
                        this.currentUserSubject.next(user);
                    }
                    return user;
                }),
                catchError(async (error) => {
                    if (
                        error.status === 0 ||
                        error.statusText === 'Unknown Error'
                    ) {
                        const userNameLower = userName.toLowerCase();
                        let useroffline = await this.db.user
                            .where('userName')
                            .equalsIgnoreCase(userNameLower)
                            .toArray();
                        if (useroffline.length == 0) {
                            throw new Error(
                                'No se encontro ningun usuario. Debera iniciar sesión con acceso a internet.'
                            );
                        } else {
                            sessionStorage.setItem(
                                'currentUser',
                                JSON.stringify(useroffline[0])
                            );
                            this.currentUserSubject.next(useroffline[0]);
                            return useroffline[0];
                        }
                    } else {
                        throw new Error(error.error.message);
                    }
                })
            );
    }

    async getCompanyInfoAsync() {
        let company: CompanyInfo[] = await firstValueFrom(
            this.http.get<CompanyInfo[]>(
                `${environment.uriLogistic}/api/Common/GetCompanyInfo`
            )
        );
        if (company.length === 0) {
            //iniciar configuración
            this.router.navigate(['/wizar-configuracion']);
            return;
        }
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

    async logout() {
        sessionStorage.removeItem('currentUser');
        await this.db.clearAllTables();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
        //this.changeTheme('lara-light-indigo', false);
    }

    changeTheme(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        themeElement.setAttribute(
            'href',
            'assets/theme/' + theme + '/theme.css'
        );
        this.configService.updateConfig({
            ...this.configService.config,
            ...{ theme, dark },
        });
    }
}
