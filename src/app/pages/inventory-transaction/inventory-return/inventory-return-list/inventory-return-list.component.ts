import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryReturnDialogComponent } from '../inventory-return-dialog/inventory-return-dialog.component';
import { Messages } from 'src/app/helpers/messages';
import { InventoryReturnModel } from '../models/inventory-return-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { PrintOupPutService } from '../../inventory-output/services/print-oup-put.service';
import { InventoryReturnService } from '../services/inventory-return.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory-return-list',
  templateUrl: './inventory-return-list.component.html',
  styleUrls: ['./inventory-return-list.component.scss']
})
export class InventoryReturnListComponent implements OnInit {
    @ViewChild(InventoryReturnDialogComponent)
    InventoryReturnDialog: InventoryReturnDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de devoluciones de mercancias';
    returnInventoryList: InventoryReturnModel[];
    formFilter: FormGroup;
    constructor(
        private returnService: InventoryReturnService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
         private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
        this.formFilter = this.formBuilder.group({
            from: [
                new Date(),
                Validators.required,
            ],
            to: [
                new Date(),
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.returnInventoryList = await this.returnService.getByDate(
                this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd')
            );

            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error);
        }
    }

    returnInventoryModify(returnInventory: InventoryReturnModel[]) {
        this.returnInventoryList = returnInventory;
    }

    addReturn() {
        if(!this.auth.hasPermission("btn_add_devolution_item")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.InventoryReturnDialog.showDialog(new InventoryReturnModel(), true);
    }

    viewReturn(returnInventory: InventoryReturnModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryReturnDialog.showDialog(returnInventory, false);
    }

    editReturn(returnInventory: InventoryReturnModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryReturnDialog.showDialog(returnInventory, false);
    }

}
