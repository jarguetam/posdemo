import { Branch } from 'src/app/models/branch';
import { PointSale } from './../../../../models/point-sale';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
  selector: 'point-sale-dialog',
  templateUrl: './point-sale.dialog.component.html',
  styleUrls: ['./point-sale.dialog.component.scss']
})
export class PointSaleDialogComponent implements OnInit {
    @Output() pointModify = new EventEmitter<PointSale[]>();
    point: PointSale = new PointSale();
    branchList: Branch[];
    isAdd: boolean;
    formMode: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit() {
        this._getBranch();

    }

    showDialog(point: PointSale, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.point = point;
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

    _createFormBuild() {
        if (this.isAdd) {
            this.point.branchId = "000";
        }
        this.formMode = this.fb.group({
            pointSaleId: [this.point.pointSaleId ?? "000"],
            name: [
                this.point.name ?? "",
                Validators.required,
            ],
            branchId: [
                this.point.branchId ?? "",
                Validators.required,
            ],
            active: [
                this.point.active ?? true
            ],
            userId: [this.point.userId ?? this.usuario.userId],
        });
    }

    new() {
        this.point = undefined;
        this.formMode = undefined;
    }

    async add() {

        if (this.formMode.valid) {
            try {
                let correlative = this.formMode.value as PointSale;
                Messages.loading('Agregando', 'Agregando punto de facturacion');
                let modes = await this.commonService.addPointSale(
                    correlative
                );
                await Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.pointModify.emit(modes);
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
                let correlative = this.formMode.value as PointSale;
                Messages.loading('Editando', 'Editando punto de facturacion');
                let modes = await this.commonService.editPointSale(
                    correlative
                );
                await Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.pointModify.emit(modes);
                this.display = false;
            } catch (ex) {
                await Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }



}
