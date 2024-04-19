import { WareHouseModel } from './../models/warehouse';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ServiceWareHouseService } from '../service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-ware-house-dialog',
    templateUrl: './ware-house-dialog.component.html',
    styleUrls: ['./ware-house-dialog.component.scss'],
})
export class WareHouseDialogComponent implements OnInit {
    @Output() WareHouseModify = new EventEmitter<WareHouseModel[]>();
    wareHouse: WareHouseModel;
    isAdd: boolean;
    formWareHouse: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private wareHouseService: ServiceWareHouseService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
    }

    showDialog(wareHouse: WareHouseModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.wareHouse = wareHouse;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formWareHouse = this.fb.group({
            whsCode: [this.wareHouse.whsCode ?? 0],
            whsName: [this.wareHouse.whsName ?? '', Validators.required],
            createBy: [this.wareHouse.createBy ?? this.usuario.userId],
            active: [this.wareHouse.active ?? false],
        });
    }

    new() {
        this.wareHouse = undefined;
        this.formWareHouse = undefined;
    }

    async add() {
        if (this.formWareHouse.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando almacen de inventario'
                );
                let request = this.formWareHouse.value as WareHouseModel;
                let region = await this.wareHouseService.addWarehouse(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.WareHouseModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formWareHouse.valid) {
            try {
                let request = this.formWareHouse.value as WareHouseModel;
                if (!request.active) {
                    let cancel = await Messages.question(
                        'Inactivar',
                        'Se bloquearan todas las transacciones de inventario. ¿Seguro desea inactivar este almacen?'
                    );

                    if (cancel) {
                        try {
                            let users =
                                await this.wareHouseService.editWarehouse(
                                    request
                                );
                            Messages.closeLoading();
                            Messages.Toas('Editado Correctamente');
                            this.WareHouseModify.emit(users);
                            this.display = false;
                        } catch (ex) {
                            Messages.closeLoading();
                            Messages.warning('Advertencia', ex.error.message);
                        }
                    }
                } else {
                    let users = await this.wareHouseService.editWarehouse(
                        request
                    );
                    Messages.closeLoading();
                    Messages.Toas('Editado Correctamente');
                    this.WareHouseModify.emit(users);
                    this.display = false;
                }
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
