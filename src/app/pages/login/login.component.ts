import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription, tap } from 'rxjs';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import { Router } from '@angular/router';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { DbLocalService } from 'src/app/service/db-local.service';
import { User } from 'src/app/models/user';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .p-password input {
                width: 100%;
                padding: 1rem;
            }

            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
            .input-field {
                width: 30rem;
            }
        `,
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    valCheck: string[] = ['remember'];
    userName: string;
    password: string;

    config: AppConfig;

    subscription: Subscription;
    currentState: ConnectionState;
    status: boolean;

    constructor(
        public configService: ConfigService,
        private router: Router,
        private auth: AuthService,
        private connectionService: ConnectionService,
        private db: DbLocalService
    ) {}

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        this.connectionService
            .monitor()
            .pipe(
                tap(async (newState: ConnectionState) => {
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

    async login(): Promise<void> {
        Messages.loading('Accediendo', 'Espere un momento por favor...');
        (await this.auth.loginOnline(this.userName, this.password)).subscribe(
            (result) => {
                Messages.closeLoading();
                this.router.navigateByUrl('/');
            },
            (error) => {
                Messages.closeLoading();
                Messages.warning('Advertencia', error.message);
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
