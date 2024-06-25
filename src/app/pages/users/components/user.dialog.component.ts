import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { Role } from 'src/app/models/role';
import { Theme } from 'src/app/models/theme';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/service/common.service';
import { UserService } from 'src/app/service/users/user.service';
import { SellerService } from '../../seller/service/seller.service';
import { Correlative } from 'src/app/models/correlative-sar';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
    selector: 'user-dialog-component',
    templateUrl: './user.dialog.component.html',
})
export class UserDialogComponent implements OnInit {
    @Output() userModify = new EventEmitter<User[]>();
    user: User;
    isAdd: boolean;
    formUser: FormGroup;
    roles: Role[] = [];
    themes: Theme[] = [];
    loading: boolean = false;
    display: boolean = false;
    sellerList: SellerModel[] = [];
    wareHouseList: WareHouseModel[]=[];
    correlativeList: Correlative[];
    userInfo: User;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private commonService: CommonService,
        private sellerService: SellerService,
        private warehouseService: ServiceWareHouseService,
        private authService: AuthService,
    ) {this.userInfo = this.authService.UserValue;}

    ngOnInit() {}
    async _getRoles() {
        try {
            this.loading = true;
            this.roles = await this.userService.getRoles();
            this.themes = await this.userService.getThemes();
            this.sellerList = await this.sellerService.getSeller();
            this.wareHouseList = await this.warehouseService.getWarehouseActive();
            this.correlativeList = await this.commonService.getCorrelativeInvoice();
            this.correlativeList.unshift({
                userName: '',
                pointSale: '',
                branch: '',
                correlativeId: 0,
                authorizeRangeFrom: 0,
                authorizeRangeTo: 0,
                currentCorrelative: 0,
                cai: '',
                branchId: '',
                pointSaleId: '',
                typeDocument: '',
                typeDocumentName: '',
                dateLimit: undefined,
                userId: 0,
                createDate: undefined,
                description: 'Seleccione la numeracion'
            });
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
            this.roles.unshift({
                roleId: 0,
                description: 'Seleccione un Rol',
                active: true,
                detail: [],
            });
            this.themes.unshift({
                themeId: 0,
                description: 'Seleccione un Tema',
                active: true,
            });
            this.loading = false;
        } catch (ex) {
            Messages.warning('Advertencia', ex.error.message);
            this.loading = false;
        }
    }

    showDialog(user: User, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.user = user;
        this._createFormBuild();
        this.display = true;
        this._getRoles();
    }
    _createFormBuild() {
        this.formUser = this.fb.group({
            userId: [this.user.userId ?? 0],
            name: [this.user.name ?? '', Validators.required],
            userName: [this.user.userName ?? '', Validators.required],
            password: [
                '',
                Validators.compose(this.isAdd ? [Validators.required] : []),
            ],
            email: [
                this.user.email ?? '',
                Validators.compose([Validators.required, Validators.email]),
            ],
            roleId: [
                this.user.roleId ?? 0,
                Validators.compose([Validators.required, Validators.min(1)]),
            ],
            themeId: [
                this.user.themeId ?? 0,
                Validators.compose([Validators.required, Validators.min(1)]),
            ],
            active: [this.user.active ?? false],
            sellerId: [this.user.sellerId ?? 0, Validators.compose([Validators.required, Validators.min(1)])],
            whsCode: [this.user.whsCode ?? 0, Validators.compose([Validators.required, Validators.min(1)])],

            salesPerson: [this.user.salesPerson ?? false],
            editPrice: [this.user.editPrice ?? false],
            sarCorrelativeId: [this.user.sarCorrelativeId ?? false, Validators.compose([Validators.required, Validators.min(1)]),],
        });
    }

    new() {
        this.user = undefined;
        this.formUser = undefined;
    }

    async add() {
        if (this.formUser.valid) {
            try {
                Messages.loading('Agregando', 'Agregando Usuario');
                let users = await this.userService.add(this.formUser.value);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.userModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formUser.valid) {
            try {
                Messages.loading('Editando', 'Editando Usuario');
                let request = this.formUser.value;
                let users = await this.userService.edit(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                if(this.userInfo.userId === request.userId){
                        Messages.warning('Advertencia', 'Ha modificado su usuario, para que los cambios se apliquen es necesario inicie su session nuevamente.');

                    this.authService.logout();
                }
                this.userModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
