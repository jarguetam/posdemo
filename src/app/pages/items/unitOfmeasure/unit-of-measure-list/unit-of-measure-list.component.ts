import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { UnitOfMeasureModel } from '../../models/unit-of-measure';
import { ItemService } from '../../service/items.service';
import { UnitOfMeasureDialogComponent } from '../unit-of-measure-dialog/unit-of-measure-dialog.component';

@Component({
  selector: 'app-unit-of-measure-list',
  templateUrl: './unit-of-measure-list.component.html',
  styleUrls: ['./unit-of-measure-list.component.scss']
})
export class UnitOfMeasureListComponent implements OnInit {
    @ViewChild(UnitOfMeasureDialogComponent) UnitOfMeasureDialog: UnitOfMeasureDialogComponent;
    title: string = "Listado de unidades de medida";
    unitOfMeasureList: UnitOfMeasureModel[];
    loading: boolean = false;
    constructor(
        private itemService: ItemService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getUnitOfMeasure();
    }

    async _getUnitOfMeasure() {
        try {
            this.loading = true;
            this.unitOfMeasureList = await this.itemService.getUnitOfMeasure();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    UnitOfMeasureModify(unitOfMeasure)
    {
        this.unitOfMeasureList= unitOfMeasure;
    }

    editUnitOfMeasure(unitOfMeasure: UnitOfMeasureModel){
        if(!this.auth.hasPermission("btn_edit_category")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.UnitOfMeasureDialog.showDialog(unitOfMeasure, false);
      }

      addUnitOfMeasure(){
        if(!this.auth.hasPermission("btn_add_category")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.UnitOfMeasureDialog.showDialog(new UnitOfMeasureModel(), true);
      }


}
