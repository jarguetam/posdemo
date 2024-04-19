import { CustomersService } from './../../service/customers.service';
import { CustomerCategoryModel } from './../../models/category';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategorydialogComponent } from '../categorydialog/categorydialog.component';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
  selector: 'app-listcategory',
  templateUrl: './listcategory.component.html',
  styleUrls: ['./listcategory.component.scss']
})
export class ListcategoryComponent implements OnInit {
    @ViewChild(CategorydialogComponent) Categorydialog: CategorydialogComponent;
    title: string = "Listado de categorias de clientes";
    customerCategoryList: CustomerCategoryModel[];
    loading: boolean = false;
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getCustomerCategory();
    }

    async _getCustomerCategory() {
        try {
            this.loading = true;
            this.customerCategoryList = await this.customerService.getCustomerCategory();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    customerCategoryModify(customerCategory)
    {
        this.customerCategoryList= customerCategory;
    }

    editCustomerCategory(customerCategory: CustomerCategoryModel){
        if(!this.auth.hasPermission("btn_edit_category")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.Categorydialog.showDialog(customerCategory, false);
      }

      addCustomerCategory(){
        if(!this.auth.hasPermission("btn_add_category")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.Categorydialog.showDialog(new CustomerCategoryModel(), true);
      }

}
