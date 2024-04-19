import { CommonService } from 'src/app/service/common.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayCondition } from 'src/app/models/paycondition';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-paycondition-dialog',
    templateUrl: './payconditiondialog.component.html',
    styleUrls: ['./payconditiondialog.component.scss'],
})
export class PayconditiondialogComponent implements OnInit {
    @Output() PayConditionModify = new EventEmitter<PayCondition[]>();
    payCondition: PayCondition;
    isAdd: boolean;
    formPayCondition: FormGroup;
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

    ngOnInit(): void {
        this._createFormBuild();
    }

    showDialog(payCondition: PayCondition, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.payCondition = payCondition;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formPayCondition = this.fb.group({
            payConditionId: [this.payCondition.payConditionId ?? 0],
            payConditionName: [
                this.payCondition.payConditionName ?? '',
                Validators.required,
            ],
            payConditionDays: [
                this.payCondition.payConditionDays ?? '',
                Validators.required,
            ],
            createBy: [this.payCondition.createBy ?? this.usuario.userId],
            active: [this.payCondition.active ?? false],
        });
    }

    new() {
        this.payCondition = undefined;
        this.formPayCondition = undefined;
    }

    async add() {
        if (this.formPayCondition.valid) {
            try {
                Messages.loading('Agregando', 'Agregando condicion de pago');
                let request = this.formPayCondition.value as PayCondition;
                let region = await this.commonService.addPayCondition(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.PayConditionModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formPayCondition.valid) {
            try {
                Messages.loading('Editando', 'Editando condicion de pago');
                let request = this.formPayCondition.value as PayCondition;
                let users = await this.commonService.editPayCondition(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.PayConditionModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
