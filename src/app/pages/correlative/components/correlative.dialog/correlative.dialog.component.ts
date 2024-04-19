import { PointSale } from './../../../../models/point-sale';
import { Correlative } from './../../../../models/correlative-sar';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import { Branch } from 'src/app/models/branch';
import { TypeDocument } from 'src/app/models/type-document';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'correlative-dialog',
    templateUrl: './correlative.dialog.component.html',
    styleUrls: ['./correlative.dialog.component.scss'],
})
export class CorrelativeDialogComponent implements OnInit {
    @Output() correlativeModify = new EventEmitter<Correlative[]>();
    correlative: Correlative = new Correlative();
    branchList: Branch[];
    pointSaleList: PointSale[];
    isAdd: boolean;
    formMode: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    typeList: TypeDocument[];
    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit() {
        this._getBranch();
        this._getPointSale();
        this._getType();
    }

    showDialog(correlative: Correlative, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;

        this.correlative = correlative;
        this.loading = false;
        this._createFormBuild();
    }

    async _getBranch() {
        try {
            this.loading = true;
            this.branchList = await this.commonService.getBranch();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async _getPointSale() {
        try {
            this.loading = true;
            this.pointSaleList = await this.commonService.getPointSale();

            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async _getType() {
        try {
            this.loading = true;
            this.typeList = await this.commonService.getTypeDocument();
            this.typeList.unshift({
                typeDocument: 0,
                name:'Seleccione el tipo'
            })
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    _createFormBuild() {
        if (this.isAdd) {
            this.correlative.branchId = "000";
            this.correlative.pointSaleId ="001";
            this.correlative.dateLimit = new Date();
        }
        this.formMode = this.fb.group({
            description: [this.correlative.description ?? '', Validators.required],
            correlativeId: [this.correlative.correlativeId ?? 0],
            authorizeRangeFrom: [
                this.correlative.authorizeRangeFrom ?? 0,
                Validators.required,
            ],
            authorizeRangeTo: [
                this.correlative.authorizeRangeTo ?? 0,
                Validators.required,
            ],
            currentCorrelative: [
                this.correlative.currentCorrelative ?? 0,
                Validators.required,
            ],
            cai: [this.correlative.cai ?? '', Validators.required],
            branchId: [this.correlative.branchId ?? '000', Validators.required],
            pointSaleId: [this.correlative.pointSaleId ?? '000'],
            typeDocument: [this.correlative.typeDocument ?? '00'],
            dateLimit: [
                new Date(this.correlative.dateLimit)
                    .toISOString()
                    .substring(0, 10) ?? '',
            ],
            userId: [this.correlative.userId ?? this.usuario.userId],
        });
    }

    new() {
        this.correlative = undefined;
        this.formMode = undefined;
    }

    async add() {
        if (this.formMode.valid) {
            try {
                let correlative = this.formMode.value as Correlative;
                Messages.loading('Agregando', 'Agregando numeracion');
                let modes = await this.commonService.addCorrelative(
                    correlative
                );
                await Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.correlativeModify.emit(modes);
                this.display = false;
            } catch (ex) {
                await Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formMode.valid) {
            try {
                let correlative = this.formMode.value as Correlative;
                Messages.loading('Editando', 'Editando numeracion');
                let modes = await this.commonService.editCorrelative(
                    correlative
                );
                await Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.correlativeModify.emit(modes);
                this.display = false;
            } catch (ex) {
                await Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
