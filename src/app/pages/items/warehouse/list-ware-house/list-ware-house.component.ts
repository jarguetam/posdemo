import { WareHouseDialogComponent } from './../ware-house-dialog/ware-house-dialog.component';
import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceWareHouseService } from '../service/service-ware-house.service';
import { WareHouseModel } from './../models/warehouse';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-list-ware-house',
    templateUrl: './list-ware-house.component.html',
    styleUrls: ['./list-ware-house.component.scss'],
})
export class ListWareHouseComponent implements OnInit {
    @ViewChild(WareHouseDialogComponent) WareHouseDialog: WareHouseDialogComponent;
    title: string = 'Listado de almacenes';
    wareHouseList: WareHouseModel[];
    loading: boolean = false;
    constructor(
        private wareHouseService: ServiceWareHouseService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getWareHouse();
    }

    async _getWareHouse() {
        try {
            this.loading = true;
            this.wareHouseList = await this.wareHouseService.getWarehouse();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    wareHouseModify(wareHouse)
    {
        this.wareHouseList= wareHouse;
    }

    editWareHouse(wareHouse: WareHouseModel){
        if(!this.auth.hasPermission("btn_edit_warehouse")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.WareHouseDialog.showDialog(wareHouse, false);
      }

      addWareHouse(){
        if(!this.auth.hasPermission("btn_add_warehouse")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.WareHouseDialog.showDialog(new WareHouseModel(), true);
      }
}
