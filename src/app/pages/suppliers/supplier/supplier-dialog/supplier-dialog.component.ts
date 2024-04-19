import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { PayCondition } from 'src/app/models/paycondition';
import { User } from 'src/app/models/user';
import { ViewJornalBpDialogComponent } from 'src/app/pages/common/view-jornal-bp-dialog/view-jornal-bp-dialog.component';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { SupplierCategoryModel } from '../../models/category-supplier';
import { SupplierModel } from '../../models/supplier';
import { SuppliersService } from '../../service/suppliers.service';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss']
})

export class SupplierDialogComponent implements OnInit {
    @Output() SupplierModify = new EventEmitter<SupplierModel[]>();
    @ViewChild(ViewJornalBpDialogComponent) ViewJornalBpDialog: ViewJornalBpDialogComponent;
    supplier: SupplierModel;
    isAdd: boolean;
    formSupplier: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    payConditionList: PayCondition[];
    categoryList: SupplierCategoryModel[];


    constructor(
        private fb: FormBuilder,
        private supplierService: SuppliersService,
        private authService: AuthService,
        private commonService: CommonService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        //this._createFormBuild();
    }

    showDialog(supplier: SupplierModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.supplier = supplier;
        this._createFormBuild();
        this.display = true;
        this._getData();
    }

    showBpJornal(){
        if(!this.authService.hasPermission("btn_history")){
            Messages.warning("No tiene acceso", "No puede ver historial de transacciones, por favor solicite el acceso.")
            return;
          }
        this.ViewJornalBpDialog.showDialog(this.supplier.supplierId, 'P');
    }

    async _getData() {
        try {
            this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            this.payConditionList.unshift({
                payConditionId: 0,
                payConditionName: 'Seleccione la condicion de pago',
                payConditionDays: 0,
                createBy: 0,
                createByName: '',
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
        try {
            this.loading = true;
            this.categoryList =
                await this.supplierService.getSupplierCategoryActive();
            this.categoryList.unshift({
                supplierCategoryId: 0,
                supplierCategoryName: 'Seleccione la categoria',
                createBy: 0,
                createByName: '',
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

    _createFormBuild() {
        this.formSupplier = this.fb.group({
            supplierId: [this.supplier.supplierId ?? 0],
            supplierName: [
                this.supplier.supplierName ?? '',
                Validators.required,
            ],
            rtn: [
                this.supplier.rtn ?? '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(13),
                    Validators.maxLength(14),
                    Validators.pattern('[0-9]*'),
                ]),
            ],
            phone: [
                this.supplier.phone ?? '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    Validators.pattern('^((\\+91-?)|0)?[0-9]{8}$'),
                ]),
            ],
            email: [this.supplier.email ?? '', Validators.required],
            address: [this.supplier.address ?? '', Validators.required],
            supplierCategoryId: [
                this.supplier.supplierCategoryId ?? '',
                Validators.required,
            ],
            payConditionId: [
                this.supplier.payConditionId ?? '',
                Validators.required,
            ],
            creditLine: [this.supplier.creditLine ?? 0],
            tax: [this.supplier.tax ?? true],
            createBy: [this.supplier.createBy ?? this.usuario.userId],
            active: [this.supplier.active ?? false],
            balance: [this.supplier.balance ?? 0]
        });
        this.formSupplier.controls['balance'].disable({onlySelf: false});
    }

    new() {
        this.supplier = undefined;
        this.formSupplier = undefined;
    }

    async add() {
        if (this.formSupplier.valid) {
            try {
                Messages.loading('Agregando', 'Agregando proveedor');
                let request = this.formSupplier.value as SupplierModel;
                let region = await this.supplierService.addSupplier(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.SupplierModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formSupplier.valid) {
            try {
                Messages.loading('Editando', 'Editando proveedor');
                let request = this.formSupplier.value as SupplierModel;
                let users = await this.supplierService.editSupplier(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.SupplierModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
