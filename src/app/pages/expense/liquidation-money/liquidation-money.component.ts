import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiquidationService } from '../services/liquidation.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { SellerModel } from '../../seller/models/seller';
import { Messages } from 'src/app/helpers/messages';
import { SellerService } from '../../seller/service/seller.service';
import { MoneyBillsModel } from '../models/money-model';
import { Router } from '@angular/router';
import {
    MoneyLiquidationDetail,
    MoneyLiquidationModel,
} from '../models/money-liquidation-model';
import { PrintMoneyLiquidationService } from './service/print.service';

@Component({
    selector: 'app-liquidation-money',
    templateUrl: './liquidation-money.component.html',
    styleUrls: ['./liquidation-money.component.scss'],
})
export class LiquidationMoneyComponent implements OnInit {
    billetesForm: FormGroup;
    loading: boolean = false;
    usuario: User;
    title: string = 'Liquidacion de dinero';
    sellerList: SellerModel[];
    liquidationData: MoneyLiquidationModel;
    isEdit: boolean = false;

    constructor(
        private fb: FormBuilder,
        private billetesService: LiquidationService,
        private auth: AuthService,
        private sellerService: SellerService,
        private router: Router,
        private printService: PrintMoneyLiquidationService
    ) {
        this._getSellers();
        this.usuario = this.auth.UserValue;
        this._createForm();
    }

    _createForm() {
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        this.billetesForm = this.fb.group({
            liquidationId: [this.liquidationData?.liquidationId || 0],
            expenseDate: [
                this.liquidationData?.expenseDate
                    ? new Date(this.liquidationData.expenseDate)
                          .toISOString()
                          .substring(0, 10)
                    : localDateString,
                Validators.required,
            ],
            comment: [this.liquidationData?.comment || '-'],
            total: [this.liquidationData?.total || 0],
            deposit: [this.liquidationData?.deposit || 0],
            sellerId: [this.liquidationData?.sellerId || this.usuario.sellerId],
            createdBy: [this.liquidationData?.createdBy || this.usuario.userId],
            details: this.fb.array([]),
        });

        // Si hay detalles en liquidationData, los agregamos al FormArray
        if (
            this.liquidationData?.details &&
            this.liquidationData.details.length > 0
        ) {
            this.liquidationData.details.forEach((detail) => {
                this.addDetail(detail);
            });
        }
    }

    addDetail(detail?: MoneyLiquidationDetail) {
        const detailForm = this.fb.group({
            moneyId: [detail?.moneyId || ''],
            denominacion: [
                { value: detail?.denominacion || '', disabled: false },
            ],
            quantity: [detail?.quantity || 0],
            total: [detail?.total || 0],
        });

        (this.billetesForm.get('details') as FormArray).push(detailForm);
    }

    ngOnInit() {
        if (history.state.liquidationData) {
            this.liquidationData = history.state.liquidationData;
            this._createForm();
            this.isEdit = true;
        } else {
            this.isEdit = false;
            this._createForm();
            this.cargarBilletes();
        }
    }

    async _getSellers() {
        try {
            this.loading = true;
            this.sellerList = await this.sellerService.getSeller();
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione el vendedor',
                whsCode: 0,
                whsName: '',
                regionId: 0,
                regionName: '',
                createByName: '',
                createBy: 0,
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    get billetes() {
        return this.billetesForm.get('details') as FormArray;
    }

    async cargarBilletes() {
        try {
            const billetes = await this.billetesService.getMoneyBills();
            billetes.forEach((billete) => {
                this.billetes.push(
                    this.fb.group({
                        moneyId: [billete.id],
                        denominacion: [
                            { value: billete.denominacion, disabled: false },
                        ],
                        quantity: [0],
                        total: 0,
                    })
                );
            });
            this.loading = false;
        } catch (error) {
            console.error('Error al cargar billetes', error);
            this.loading = false;
        }
    }

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    }

    calcularTotal(billete: FormGroup): number {
        const denominacion = billete.get('denominacion').value;
        const quantity = billete.get('quantity').value;
        let total = denominacion * quantity;
        billete.patchValue({ total: total }, { emitEvent: false });
        return denominacion * quantity;
    }

    calcularTotalEfectivo(): number {
        return this.billetes.controls.reduce((total, billete) => {
            return total + this.calcularTotal(billete as FormGroup);
        }, 0);
    }

    calcularTotalGeneral(): number {
        return (this.billetes.controls.reduce((total, billete) => {
            return total + this.calcularTotal(billete as FormGroup);
        }, 0) + this.billetesForm.get('deposit').value) as number;
    }

    onQuantityChange(billete: FormGroup) {
        this.calcularTotal(billete);
        this.calcularTotalGeneral();
    }

    onFocusDeposit() {
        this.billetesForm.patchValue({ deposit: null }, { emitEvent: false });
    }

    async guardarBilletes() {
        try {
            if (this.billetesForm.valid) {
                Messages.loading('Guardando', 'Guardando Solicitud');
                let total = this.billetes.controls.reduce((total, billete) => {
                    return total + this.calcularTotal(billete as FormGroup);
                }, 0)+ this.billetesForm.get('deposit').value as number;
                this.billetesForm.patchValue(
                    { total: total },
                    { emitEvent: false }
                );
                let result;
                if (this.isEdit) {
                    result = await this.billetesService.editLiquidationMoney(
                        this.billetesForm.value
                    );
                } else {
                    result = await this.billetesService.addLiquidationMoney(
                        this.billetesForm.value
                    );
                }

                Messages.closeLoading();
                Messages.ok('Completado');
                await this.print(result[0]);
                this.billetesForm.reset();
                this.billetes.clear();
                this._createForm();
                this.cargarBilletes();
                await this.router.navigate(
                    ['/liquidaciones/liquidacion-dinero-listado'],
                    {
                        state: {},
                    }
                );
            }
        } catch (ex) {
            Messages.closeLoading();
            if (ex.error && ex.error.message) {
                Messages.warning('Advertencia', ex.error.message);
            } else {
                Messages.warning('Advertencia', ex.message);
            }
        }
    }

    private goBack() {
        this.router.navigate(['/liquidaciones/liquidacion-dinero-listado'], {
            state: {},
        });
    }

    print(request: MoneyLiquidationModel) {
        this.printService.printLiquidation(request);
    }
}
