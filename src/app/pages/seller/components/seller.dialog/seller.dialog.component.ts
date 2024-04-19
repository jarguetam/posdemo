import { AuthService } from 'src/app/service/users/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { SellerModel } from '../../models/seller';
import { SellerRegion } from '../../models/seller-region';
import { SellerService } from '../../service/seller.service';
import { ServiceWareHouseService } from './../../../items/warehouse/service/service-ware-house.service';
import { User } from 'src/app/models/user';
import { WareHouseModel } from './../../../items/warehouse/models/warehouse';

@Component({
    selector: 'app-seller-dialog',
    templateUrl: './seller.dialog.component.html',
    styleUrls: ['./seller.dialog.component.scss'],
})
export class SellerDialogComponent implements OnInit {
    @Output() SellerModify = new EventEmitter<SellerModel[]>();
    seller: SellerModel;
    isAdd: boolean;
    formSeller: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    sellerRegionList: SellerRegion[];
    wareHouseList: WareHouseModel[];

    constructor(
        private fb: FormBuilder,
        private sellerService: SellerService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
    }

    showDialog(seller: SellerModel, isAdd: boolean) {
        this.new();
        this._getData();
        this.isAdd = isAdd;
        this.seller = seller;
        this._createFormBuild();
        this.display = true;
    }

    async _getData(){
        try {
            this.loading = true;
            this.sellerRegionList = await this.sellerService.getSellerRegionActive();
            this.sellerRegionList.unshift({
                regionId: 0,
                nameRegion: 'Seleccione una region',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.wareHouseList = await this.wareHouseService.getWarehouseActive();
            this.wareHouseList.unshift({
                whsCode: 0,
                whsName: 'Seleccione un almacen',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    _createFormBuild() {
        this.formSeller = this.fb.group({
            sellerId: [this.seller.sellerId ?? 0],
            sellerName: [this.seller.sellerName ?? '', Validators.required],
            whsCode: [this.seller.whsCode ?? '', Validators.required],
            regionId: [this.seller.regionId ?? '', Validators.required],
            createBy: [this.seller.createBy ?? this.usuario.userId],
            active: [this.seller.active ?? false],
        });
    }

    new() {
        this.seller = undefined;
        this.formSeller = undefined;
    }

    async add() {
        if (this.formSeller.valid) {
            try {
                Messages.loading('Agregando', 'Agregando vendedor');
                let request = this.formSeller.value as SellerModel;
                let region = await this.sellerService.addSeller(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.SellerModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formSeller.valid) {
            try {
                Messages.loading('Editando', 'Editando vendedor');
                let request = this.formSeller.value as SellerModel;
                let users = await this.sellerService.editSeller(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.SellerModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
