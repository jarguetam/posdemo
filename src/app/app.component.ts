import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from './service/common.service';
import { AuthService } from './service/users/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    menuMode = 'static';
    constructor(
        private primengConfig: PrimeNGConfig,
        private commonService: CommonService,
        private authService: AuthService
    ) {
        this.primengConfig.setTranslation({
            ...this.primengConfig.getTranslation('es-HN'),
            dateFormat: 'dd/mm/yy',
            timeFormat: 'HH:mm:ss',
            firstDayOfWeek: 0
        });

        // Configuración para zona horaria Honduras
        this.primengConfig.setTranslation({
            dateFormat: 'dd/mm/yy',
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        });
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.primengConfig.setTranslation({
            firstDayOfWeek: 0,
            dayNames: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miércoles',
                'Jueves',
                'Viernes',
                'Sábado',
            ],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            monthNames: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            monthNamesShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
            ],
            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Sem',
        });

        document.documentElement.style.fontSize = '14px';
        this.getCompany();
    }
    async getCompany() {
        if (this.authService.UserValue) {
            // await this.commonService.getCompanyInfoAsync();
        }
    }
}
