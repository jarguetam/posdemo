import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { UnitOfMeasureModel } from '../../models/unit-of-measure';
import { ItemService } from '../../service/items.service';

@Component({
  selector: 'app-unit-of-measure-dialog',
  templateUrl: './unit-of-measure-dialog.component.html',
  styleUrls: ['./unit-of-measure-dialog.component.scss']
})
export class UnitOfMeasureDialogComponent implements OnInit {
    @Output() UnitOfMeasureModify = new EventEmitter<UnitOfMeasureModel[]>();
    unitOfMeasure: UnitOfMeasureModel;
    isAdd: boolean;
    formUnitOfMeasure: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private itemService: ItemService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
    }

    showDialog(unitOfMeasure: UnitOfMeasureModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.unitOfMeasure = unitOfMeasure;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formUnitOfMeasure = this.fb.group({
            unitOfMeasureId: [this.unitOfMeasure.unitOfMeasureId ?? 0],
            unitOfMeasureName: [
                this.unitOfMeasure.unitOfMeasureName ?? '',
                Validators.required,
            ],
            createBy: [this.unitOfMeasure.createBy ?? this.usuario.userId],
            active: [this.unitOfMeasure.active ?? false],
        });
    }

    new() {
        this.unitOfMeasure = undefined;
        this.formUnitOfMeasure = undefined;
    }

    async add() {
        if (this.formUnitOfMeasure.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando unidad de medida'
                );
                let request = this.formUnitOfMeasure.value as UnitOfMeasureModel;
                let region = await this.itemService.addUnitOfMeasure(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.UnitOfMeasureModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formUnitOfMeasure.valid) {
            try {
                Messages.loading('Editando', 'Editando unidad de medida');
                let request = this.formUnitOfMeasure.value as UnitOfMeasureModel;
                let users = await this.itemService.editUnitOfMeasure(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.UnitOfMeasureModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

}
