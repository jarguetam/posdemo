import { PriceListModel } from './../../models/pricelist';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CustomersService } from '../../service/customers.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-pricelist-dialog',
    templateUrl: './pricelistdialog.component.html',
    styleUrls: ['./pricelistdialog.component.scss'],
})
export class PricelistdialogComponent implements OnInit {
    @Output() PriceListModify = new EventEmitter<PriceListModel[]>();
    priceList: PriceListModel;
    isAdd: boolean;
    formPriceList: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private customerService: CustomersService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
    }

    showDialog(priceList: PriceListModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.priceList = priceList;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formPriceList = this.fb.group({
            listPriceId: [this.priceList.listPriceId ?? 0],
            listPriceName: [
                this.priceList.listPriceName ?? '',
                Validators.required,
            ],
            porcentGain: [this.priceList.porcentGain ?? 0, Validators.required],
            createBy: [this.priceList.createBy ?? this.usuario.userId],
            active: [this.priceList.active ?? false],
        });
    }

    new() {
        this.priceList = undefined;
        this.formPriceList = undefined;
    }

    async add() {
        if (this.formPriceList.valid) {
            try {
                Messages.loading('Agregando', 'Agregando lista de precio');
                let request = this.formPriceList.value as PriceListModel;
                let region = await this.customerService.addPriceList(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.PriceListModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formPriceList.valid) {
            try {

                let request =  this.formPriceList.value as PriceListModel;
                if(!request.active)
                {
                    let cancel = await Messages.question(
                        'Inactivar',
                        'Se bloqueara esta lista para asignacion de precios a clientes. ¿Seguro desea inactivar este almacen?'
                    );
                if (cancel) {
                    try {
                        Messages.loading("Editando Lista", "Espere un momento...")
                        let users = await this.customerService.editPriceList(request);
                        Messages.closeLoading();
                        Messages.Toas('Editado Correctamente');
                        this.PriceListModify.emit(users);
                        this.display = false;
                    } catch (ex) {
                        Messages.closeLoading();
                        Messages.warning('Advertencia', ex.error.message);
                    }
                }
                }
                else{
                    Messages.loading("Editando Lista", "Espere un momento...")
                    let users = await this.customerService.editPriceList(request);
                    Messages.closeLoading();
                    Messages.Toas('Editado Correctamente');
                    this.PriceListModify.emit(users);
                    this.display = false;
                }
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
