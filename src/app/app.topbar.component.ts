import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AuthService } from './service/users/auth.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { SyncService } from './service/sync.service';
import { Network } from '@capacitor/network';
import { ConnectionStateService } from './service/connection-state.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    items: MenuItem[];
    forceOffline: boolean = false;
    syncProgress: number = 0;
    syncInProgress: boolean = false;
    isMobile: boolean;

    private subscriptions = new Subscription();

    constructor(
        public appMain: AppMainComponent,
        public auth: AuthService,
        private connectionStateService: ConnectionStateService,
        private syncService: SyncService
    ) {
        this.isMobile = window.innerWidth < 1024;
        this.initMenuItems();
    }

    ngOnInit() {
        this.subscriptions.add(
            this.syncService.syncProgress.subscribe((progress) => {
                this.syncProgress = progress;
                this.syncInProgress = progress > 0 && progress < 100;
            })
        );

        this.subscriptions.add(
            this.connectionStateService.forceOffline$.subscribe(
                (force) => (this.forceOffline = force)
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    toggleOfflineMode() {
        this.forceOffline = !this.forceOffline;
        this.connectionStateService.toggleForceOffline(this.forceOffline);
    }

    sync() {
        if (!this.syncInProgress && !this.forceOffline) {
            this.syncService.syncAll();
        }
    }

    private initMenuItems() {
        this.items = [
            {
                label: 'Perfil',
                icon: 'pi pi-user',
                routerLink: '/uikit/formlayout',
            },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-sign-out',
                command: () => this.auth.logout(),
            },
        ];
    }
}
