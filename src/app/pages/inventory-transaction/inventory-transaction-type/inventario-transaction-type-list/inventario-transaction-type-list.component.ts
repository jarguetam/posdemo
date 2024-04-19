import { Component, OnInit, ViewChild } from '@angular/core';
import { InventarioTransactionTypeDialogComponent } from '../inventario-transaction-type-dialog/inventario-transaction-type-dialog.component';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryTransactionTypeModel } from '../model/inventory-type-model';
import { InventoryTypeService } from '../services/inventory-type.service';

@Component({
  selector: 'app-inventario-transaction-type-list',
  templateUrl: './inventario-transaction-type-list.component.html',
  styleUrls: ['./inventario-transaction-type-list.component.scss']
})
export class InventarioTransactionTypeListComponent implements OnInit {
    @ViewChild(InventarioTransactionTypeDialogComponent) InventarioTransactionTypeDialog: InventarioTransactionTypeDialogComponent;
    title: string = "Listado de tipos de ajustes de inventario";
    transactionTypeList: InventoryTransactionTypeModel[];
    loading: boolean = false;
    constructor(
        private itemService: InventoryTypeService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getInventoryTypeTransaction();
    }

    async _getInventoryTypeTransaction() {
        try {
            this.loading = true;
            this.transactionTypeList = await this.itemService.getInventoryTransactionType();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    InventoryTypeTransactionModify(transactionType)
    {
        this.transactionTypeList= transactionType;
    }

    editInventoryTypeTransaction(transactionType: InventoryTransactionTypeModel){
        if(!this.auth.hasPermission("btn_edit_tipo_ajuste")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.InventarioTransactionTypeDialog.showDialog(transactionType, false);
      }

      addInventoryTypeTransaction(){
        if(!this.auth.hasPermission("btn_add_tipo_ajuste")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.InventarioTransactionTypeDialog.showDialog(new InventoryTransactionTypeModel(), true);
      }

}
