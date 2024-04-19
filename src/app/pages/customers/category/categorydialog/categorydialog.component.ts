import { AuthService } from 'src/app/service/users/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerCategoryModel } from './../../models/category';
import { CustomersService } from './../../service/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './categorydialog.component.html',
    styleUrls: ['./categorydialog.component.scss'],
})
export class CategorydialogComponent implements OnInit {
    @Output() CustomerCategoryModify = new EventEmitter<
        CustomerCategoryModel[]
    >();
    customerCategory: CustomerCategoryModel;
    isAdd: boolean;
    formCustomerCategory: FormGroup;
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

    showDialog(customerCategory: CustomerCategoryModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.customerCategory = customerCategory;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formCustomerCategory = this.fb.group({
            customerCategoryId: [this.customerCategory.customerCategoryId ?? 0],
            customerCategoryName: [
                this.customerCategory.customerCategoryName ?? '',
                Validators.required,
            ],
            createBy: [this.customerCategory.createBy ?? this.usuario.userId],
            active: [this.customerCategory.active ?? false],
        });
    }

    new() {
        this.customerCategory = undefined;
        this.formCustomerCategory = undefined;
    }

    async add() {
        if (this.formCustomerCategory.valid) {
            try {
                Messages.loading('Agregando', 'Agregando categoria de cliente');
                let request = this.formCustomerCategory
                    .value as CustomerCategoryModel;
                let region = await this.customerService.addCustomerCategory(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.CustomerCategoryModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formCustomerCategory.valid) {
            try {
                Messages.loading('Editando', 'Editando categoria de cliente');
                let request = this.formCustomerCategory
                    .value as CustomerCategoryModel;
                let users = await this.customerService.editCustomerCategory(
                    request
                );
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.CustomerCategoryModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
