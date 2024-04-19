import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemCategoryModel } from '../../models/category-items';
import { ItemService } from '../../service/items.service';
import { CategoryItemsDialogComponent } from '../category-items-dialog/category-items-dialog.component';

@Component({
  selector: 'app-category-items-list',
  templateUrl: './category-items-list.component.html',
  styleUrls: ['./category-items-list.component.scss']
})
export class CategoryItemsListComponent implements OnInit {
    @ViewChild(CategoryItemsDialogComponent) CategoryItemsDialog: CategoryItemsDialogComponent;
    title: string = "Listado de categorias de articulos";
    itemsCategoryList: ItemCategoryModel[];
    loading: boolean = false;
    constructor(
        private itemService: ItemService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getItemsCategory();
    }

    async _getItemsCategory() {
        try {
            this.loading = true;
            this.itemsCategoryList = await this.itemService.getItemsCategory();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    ItemsCategoryModify(itemsCategory)
    {
        this.itemsCategoryList= itemsCategory;
    }

    editItemsCategory(itemsCategory: ItemCategoryModel){
        if(!this.auth.hasPermission("btn_edit_category")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.CategoryItemsDialog.showDialog(itemsCategory, false);
      }

      addItemsCategory(){
        if(!this.auth.hasPermission("btn_add_category")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.CategoryItemsDialog.showDialog(new ItemCategoryModel(), true);
      }

}
