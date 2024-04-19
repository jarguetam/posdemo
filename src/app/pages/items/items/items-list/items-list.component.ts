import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemModel } from '../../models/items';
import { ItemsDialogComponent } from '../items-dialog/items-dialog.component';
import { ItemService } from '../../service/items.service';
import { Messages } from 'src/app/helpers/messages';
import { BarcodeService } from '../../service/barcode-service.service';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
    @ViewChild(ItemsDialogComponent) ItemsDialog: ItemsDialogComponent;
    title: string = "Listado de articulos";
    itemsList: ItemModel[];
    loading: boolean = false;
    constructor(
        private itemService: ItemService,
        private auth: AuthService,
        private barCode: BarcodeService,
    ) {}

    ngOnInit(): void {
        this._getItems();
    }

    async _getItems() {
        try {
            Messages.loading("Cargando...", "Espere un momento...");
            this.loading = true;
            this.itemsList = await this.itemService.getItems();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    ItemsModify(items)
    {
        this.itemsList= items;
    }

    editItems(items: ItemModel){
        if(!this.auth.hasPermission("btn_edit_item")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.ItemsDialog.showDialog(items, false);
      }

      addItems(){
        if(!this.auth.hasPermission("btn_add_item")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.ItemsDialog.showDialog(new ItemModel(), true);
      }

      printBarcodes(item: ItemModel){
        const codesPerPage = 12;
        this.barCode.generateBarcode(item.barCode, codesPerPage);
    }

}
