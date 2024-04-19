import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { SupplierCategoryModel } from '../../models/category-supplier';
import { SuppliersService } from '../../service/suppliers.service';
import { CategorySupplierDialogComponent } from '../category-supplier-dialog/category-supplier-dialog.component';

@Component({
  selector: 'app-category-supplier-list',
  templateUrl: './category-supplier-list.component.html',
  styleUrls: ['./category-supplier-list.component.scss']
})
export class CategorySupplierListComponent implements OnInit {
    @ViewChild(CategorySupplierDialogComponent) CategorySupplierDialog: CategorySupplierDialogComponent;
    title: string = "Listado de categorias de proveedores";
    supplierCategoryList: SupplierCategoryModel[];
    loading: boolean = false;
    constructor(
        private supplierService: SuppliersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getSupplierCategory();
    }

    async _getSupplierCategory() {
        try {
            this.loading = true;
            this.supplierCategoryList = await this.supplierService.getSupplierCategory();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    supplierCategoryModify(supplierCategory)
    {
        this.supplierCategoryList= supplierCategory;
    }

    editSupplierCategory(supplierCategory: SupplierCategoryModel){
        if(!this.auth.hasPermission("btn_edit_category")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.CategorySupplierDialog.showDialog(supplierCategory, false);
      }

      addSupplierCategory(){
        if(!this.auth.hasPermission("btn_add_category")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.CategorySupplierDialog.showDialog(new SupplierCategoryModel(), true);
      }


}
