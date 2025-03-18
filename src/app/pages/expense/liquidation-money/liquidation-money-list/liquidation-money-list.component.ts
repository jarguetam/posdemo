import { Component, OnInit } from '@angular/core';
import { MoneyLiquidationModel } from '../../models/money-liquidation-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiquidationService } from '../../services/liquidation.service';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { LiquidationModel } from '../../models/liquidation-model';
import { Router } from '@angular/router';
import { PrintMoneyLiquidationService } from '../service/print.service';
import { PrintResumService } from '../service/print-resum.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-liquidation-money-list',
    templateUrl: './liquidation-money-list.component.html',
    styleUrls: ['./liquidation-money-list.component.scss'],
})
export class LiquidationMoneyListComponent implements OnInit {
    loading: boolean = false;
    user: User;
    title: string = 'Listado de liquidaciones';
    liquidationList: MoneyLiquidationModel[];
    formFilter: FormGroup;
    constructor(
        private liquidationService: LiquidationService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private printService: PrintMoneyLiquidationService,
        private printResumService: PrintResumService
    ) {
        this.user = this.auth.UserValue;
    }

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        this.formFilter = this.formBuilder.group({
            from: [localDateString, Validators.required],
            to: [localDateString, Validators.required],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.liquidationList =
                await this.liquidationService.getMoneyLiquidationByDate(
                    this.formFilter.value.from,
                    this.formFilter.value.to
                );
                if (this.user.roleId != 1) {
                    this.liquidationList = this.liquidationList.filter(
                        (x) => x.sellerId === this.user.sellerId
                    );
                }
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    liquidationModify(liquidation: MoneyLiquidationModel[]) {
        this.liquidationList = liquidation;
    }

    async addLiquidation() {
        if (!this.auth.hasPermission('btn_agregar_liquidacion')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        await this.router.navigate(['/liquidaciones/liquidacion-dinero'], {
            state: {},
        });
    }

    async editLiquidation(liquidation: LiquidationModel) {
        if (!this.auth.hasPermission('btn_editar_liquidacion')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar, por favor solicite el acceso.'
            );
            return;
        }

        await this.router.navigate(['/liquidaciones/liquidacion-dinero'], {
            state: { liquidationData: liquidation },
        });
    }

    viewLiquidation(liquidation: LiquidationModel) {
        if (!this.auth.hasPermission('btn_editar_liquidacion')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
    }

    print(request: MoneyLiquidationModel) {
        this.printService.printLiquidation(request);
    }

    async printResum(request: MoneyLiquidationModel) {

        let result = await this.liquidationService.getLiquidationResum(
            request.sellerId,
            request.expenseDate
        );

        this.printResumService.printLiquidation(result, request.seller.sellerName, request.total);
    }
}
