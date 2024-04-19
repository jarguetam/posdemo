import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '../app.main.component';
import { AuthService } from '../service/users/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: 'app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    isMobile: boolean;
    model: any[];

    constructor(public appMain: AppMainComponent, private auth: AuthService) {
        this.isMobile = this.isMobileDevice();
    }

    ngOnInit() {
        this.model = this.auth.UserValue.menu;

    }

    isMobileDevice() {
        return window.innerWidth < 1024;
      }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
