import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from './service/common.service';
import { AuthService } from './service/users/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';
    constructor(private primengConfig: PrimeNGConfig, private commonService: CommonService, private authService: AuthService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.getCompany();
    }
    async getCompany(){
        if(this.authService.UserValue){
       // await this.commonService.getCompanyInfoAsync();
        }
    }
}
