import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AuthService } from './service/users/auth.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { SyncService } from './service/sync.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
})
export class AppTopBarComponent {
    items: MenuItem[];
    currentState: ConnectionState;
    status: boolean;
    isMobile: boolean;

    constructor(
        public appMain: AppMainComponent,
        public auth: AuthService,
        private connectionService: ConnectionService,
        private syncService: SyncService
    ) {
        this.isMobile = this.isMobileDevice();
        this.items = [
            {
                label: 'Perfil',
                icon: 'pi pi-user',
                routerLink: '/uikit/formlayout',
            },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.auth.logout();
                },
            },
        ];
    }

    ngOnInit(): void {
        this.connectionService
            .monitor()
            .pipe(
                tap(async (newState: ConnectionState) => {
                    this.currentState = newState;
                    if (this.currentState.hasNetworkConnection) {
                        this.status = true;
                       
                      //  await this.syncService.syncData();
                        //this.getInvoice();
                    } else {
                        this.status = false;
                    }
                })
            )
            .subscribe();
    }

    getStyle() {
        return this.status ? 'pi pi-check-circle connected' : 'pi pi-times-circle disconnected';
      }

      isMobileDevice() {
        return window.innerWidth < 1024;
      }

    logout(){
        this.auth.logout();
    }
}
