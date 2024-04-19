import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemCategoryModel } from '../../models/category-items';
import { ItemService } from '../../service/items.service';

@Component({
    selector: 'app-category-items-dialog',
    templateUrl: './category-items-dialog.component.html',
    styleUrls: ['./category-items-dialog.component.scss'],
})
export class CategoryItemsDialogComponent implements OnInit {
    @Output() ItemCategoryModify = new EventEmitter<ItemCategoryModel[]>();
    itemCategory: ItemCategoryModel;
    isAdd: boolean;
    formItemCategory: FormGroup;
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

    showDialog(itemCategory: ItemCategoryModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.itemCategory = itemCategory;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formItemCategory = this.fb.group({
            itemCategoryId: [this.itemCategory.itemCategoryId ?? 0],
            itemCategoryName: [
                this.itemCategory.itemCategoryName ?? '',
                Validators.required,
            ],
            createBy: [this.itemCategory.createBy ?? this.usuario.userId],
            active: [this.itemCategory.active ?? false],
        });
    }

    new() {
        this.itemCategory = undefined;
        this.formItemCategory = undefined;
    }

    async add() {
        if (this.formItemCategory.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando categoria de articulo'
                );
                let request = this.formItemCategory.value as ItemCategoryModel;
                let region = await this.itemService.addItemsCategory(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.ItemCategoryModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formItemCategory.valid) {
            try {
                Messages.loading('Editando', 'Editando categoria de articulo');
                let request = this.formItemCategory.value as ItemCategoryModel;
                let users = await this.itemService.editItemsCategory(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.ItemCategoryModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
