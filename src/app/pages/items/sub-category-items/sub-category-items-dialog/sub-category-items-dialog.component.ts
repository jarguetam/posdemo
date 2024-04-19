import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemSubCategoryModel } from '../../models/sub-category-items';
import { ItemService } from '../../service/items.service';

@Component({
  selector: 'app-sub-category-items-dialog',
  templateUrl: './sub-category-items-dialog.component.html',
  styleUrls: ['./sub-category-items-dialog.component.scss']
})
export class SubCategoryItemsDialogComponent implements OnInit {
    @Output() ItemSubCategoryModify = new EventEmitter<ItemSubCategoryModel[]>();
    itemSubCategory: ItemSubCategoryModel;
    isAdd: boolean;
    formItemSubCategory: FormGroup;
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
        this._createFormBuild();
    }

    showDialog(itemSubCategory: ItemSubCategoryModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.itemSubCategory = itemSubCategory;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formItemSubCategory = this.fb.group({
            itemFamilyId: [this.itemSubCategory.itemFamilyId ?? 0],
            itemFamilyName: [
                this.itemSubCategory.itemFamilyName ?? '',
                Validators.required,
            ],
            createBy: [this.itemSubCategory.createBy ?? this.usuario.userId],
            active: [this.itemSubCategory.active ?? false],
        });
    }

    new() {
        this.itemSubCategory = undefined;
        this.formItemSubCategory = undefined;
    }

    async add() {
        if (this.formItemSubCategory.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando sub categoria de articulo'
                );
                let request = this.formItemSubCategory.value as ItemSubCategoryModel;
                let region = await this.itemService.addItemsSubCategory(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.ItemSubCategoryModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formItemSubCategory.valid) {
            try {
                Messages.loading('Editando', 'Editando sub categoria de articulo');
                let request = this.formItemSubCategory.value as ItemSubCategoryModel;
                let users = await this.itemService.editItemsSubCategory(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.ItemSubCategoryModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

}
