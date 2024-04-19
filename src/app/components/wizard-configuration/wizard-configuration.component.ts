import { Messages } from 'src/app/helpers/messages';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { CompanyInfoDialogComponent } from 'src/app/pages/company-info/components/company-info.dialog.component';
import { CompanyInfo } from 'src/app/models/company-info';
import { CommonService } from 'src/app/service/common.service';
import { SellerRegionDialogComponent } from 'src/app/pages/seller/components/seller-region.dialog/seller-region.dialog.component';
import { SellerRegion } from 'src/app/pages/seller/models/seller-region';
import { SellerDialogComponent } from 'src/app/pages/seller/components/seller.dialog/seller.dialog.component';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { WareHouseDialogComponent } from 'src/app/pages/items/warehouse/ware-house-dialog/ware-house-dialog.component';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { CorrelativeDialogComponent } from 'src/app/pages/correlative/components/correlative.dialog/correlative.dialog.component';
import { Correlative } from 'src/app/models/correlative-sar';
import { Router } from '@angular/router';
import { DbLocalService } from 'src/app/service/db-local.service';
import { WizardModel } from './model/wizard-model';

@Component({
    selector: 'app-wizard-configuration',
    templateUrl: './wizard-configuration.component.html',
    styleUrls: ['./wizard-configuration.component.scss'],
})
export class WizardConfigurationComponent implements OnInit {
    items: MenuItem[];
    activeIndex: number = 0;
    avance: number = 0;
    @ViewChild(CompanyInfoDialogComponent)
    CompanyInfoDialog: CompanyInfoDialogComponent;
    @ViewChild(SellerRegionDialogComponent)
    SellerRegionDialog: SellerRegionDialogComponent;
    @ViewChild(SellerDialogComponent) SellerDialog: SellerDialogComponent;
    @ViewChild(WareHouseDialogComponent)
    WareHouseDialog: WareHouseDialogComponent;
    @ViewChild(CorrelativeDialogComponent)
    CorrelativeDialog: CorrelativeDialogComponent;
    companyInfo: CompanyInfo[];
    wizard: WizardModel;
    isComplete: boolean = false;

    constructor(
        private commonService: CommonService,
        private router: Router
    ) {
    }

    ngOnInit(): void {

        this.items = [
            {
                label: 'Datos de empresa',
                command: async (event: any) => {
                    this.activeIndex = 0;
                    this.companyInfo =
                        await this.commonService.getCompanyInfo();
                    this.CompanyInfoDialog.showDialog(new CompanyInfo(), true);
                },
            },
            {
                label: 'Zonas de venta',
                command: async (event: any) => {
                    this.activeIndex = 1;
                    this.SellerRegionDialog.showDialog(
                        new SellerRegion(),
                        true
                    );
                },
            },
            {
                label: 'Almacenes',
                command: async (event: any) => {
                    this.activeIndex = 2;
                    this.WareHouseDialog.showDialog(new WareHouseModel(), true);
                },
            },
            {
                label: 'Vendedores',
                command: async (event: any) => {
                    this.activeIndex = 3;
                    this.SellerDialog.showDialog(new SellerModel(), true);
                },
            },
            {
                label: 'Correlativo',
                command: async (event: any) => {
                    this.activeIndex = 4;
                    this.CorrelativeDialog.showDialog(new Correlative(), true);
                },
            },
        ];
    }

    companyModify() {
        this.avance = 20;
        this.isComplete = this.avance === 100;
    }

    sellerRegionModify() {
        this.avance += 20;
        this.isComplete = this.avance === 100;
    }

    sellerModify() {
        this.avance += 20;
        this.isComplete = this.avance === 100;
    }

    wareHouseModify() {
        this.avance += 20;
        this.isComplete = this.avance === 100;
    }

    correlativeModify() {
        this.avance += 20;
        this.isComplete = this.avance === 100;
    }

    calculateProgressBarWidth() {
        const totalSteps = this.items.length;
        const widthPercentage = ((this.activeIndex + 1) / totalSteps) * 100;
        return `${widthPercentage}%`;
    }

    finallyWizard() {
        this.router.navigateByUrl('/');
    }
}
