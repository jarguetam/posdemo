import { SubCategoryItemsDialogComponent } from './../sub-category-items-dialog/sub-category-items-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSubCategoryModel } from '../../models/sub-category-items';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemService } from '../../service/items.service';

@Component({
  selector: 'app-sub-category-items-list',
  templateUrl: './sub-category-items-list.component.html',
  styleUrls: ['./sub-category-items-list.component.scss']
})
export class SubCategoryItemsListComponent implements OnInit {
    @ViewChild(SubCategoryItemsDialogComponent) SubCategoryItemsDialog: SubCategoryItemsDialogComponent;
    title: string = "Listado de sub categorias de articulos";
    itemsCategoryList: ItemSubCategoryModel[];
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
            this.itemsCategoryList = await this.itemService.getItemsSubCategory();
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

    editItemsCategory(itemsCategory: ItemSubCategoryModel){
        if(!this.auth.hasPermission("btn_edit")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.SubCategoryItemsDialog.showDialog(itemsCategory, false);
      }

      addItemsCategory(){
        if(!this.auth.hasPermission("btn_add")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.SubCategoryItemsDialog.showDialog(new ItemSubCategoryModel(), true);
      }

}



