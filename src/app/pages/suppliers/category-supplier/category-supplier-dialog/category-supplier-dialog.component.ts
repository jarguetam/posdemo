import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { SupplierCategoryModel } from '../../models/category-supplier';
import { SuppliersService } from '../../service/suppliers.service';

@Component({
    selector: 'app-category-supplier-dialog',
    templateUrl: './category-supplier-dialog.component.html',
    styleUrls: ['./category-supplier-dialog.component.scss'],
})
export class CategorySupplierDialogComponent implements OnInit {
    @Output() SupplierCategoryModify = new EventEmitter<
        SupplierCategoryModel[]
    >();
    supplierCategory: SupplierCategoryModel;
    isAdd: boolean;
    formSupplierCategory: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private supplierService: SuppliersService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
    }

    showDialog(supplierCategory: SupplierCategoryModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.supplierCategory = supplierCategory;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formSupplierCategory = this.fb.group({
            supplierCategoryId: [this.supplierCategory.supplierCategoryId ?? 0],
            supplierCategoryName: [
                this.supplierCategory.supplierCategoryName ?? '',
                Validators.required,
            ],
            createBy: [this.supplierCategory.createBy ?? this.usuario.userId],
            active: [this.supplierCategory.active ?? false],
        });
    }

    new() {
        this.supplierCategory = undefined;
        this.formSupplierCategory = undefined;
    }

    async add() {
        if (this.formSupplierCategory.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando categoria de proveedor'
                );
                let request = this.formSupplierCategory
                    .value as SupplierCategoryModel;
                let region = await this.supplierService.addSupplierCategory(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.SupplierCategoryModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formSupplierCategory.valid) {
            try {
                Messages.loading('Editando', 'Editando categoria de proveedor');
                let request = this.formSupplierCategory
                    .value as SupplierCategoryModel;
                let users = await this.supplierService.editSupplierCategory(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.SupplierCategoryModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
