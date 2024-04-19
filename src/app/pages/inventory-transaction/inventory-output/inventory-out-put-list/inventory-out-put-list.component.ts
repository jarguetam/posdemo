import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryOutPutDialogComponent } from '../inventory-out-put-dialog/inventory-out-put-dialog.component';
import { InventoryOutPutModel } from '../models/inventory-output';
import { InventoryOutPutService } from '../services/inventory-out-put.service';
import { Messages } from 'src/app/helpers/messages';
import { PrintOupPutService } from '../services/print-oup-put.service';

@Component({
  selector: 'app-inventory-out-put-list',
  templateUrl: './inventory-out-put-list.component.html',
  styleUrls: ['./inventory-out-put-list.component.scss']
})
export class InventoryOutPutListComponent implements OnInit {
    @ViewChild(InventoryOutPutDialogComponent)
    InventoryOutPutDialog: InventoryOutPutDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de salidas de mercancias';
    outPutList: InventoryOutPutModel[];
    formFilter: FormGroup;
    constructor(
        private outPutServices: InventoryOutPutService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintOupPutService
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            to: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.outPutList = await this.outPutServices.getByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error);
        }
    }

    outPutModify(outPut: InventoryOutPutModel[]) {
        this.outPutList = outPut;
    }

    addOutPut() {
        if(!this.auth.hasPermission("btn_add")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.InventoryOutPutDialog.showDialog(new InventoryOutPutModel(), true);
    }

    viewOutPut(outPut: InventoryOutPutModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryOutPutDialog.showDialog(outPut, false);
    }

    print(outPut: InventoryOutPutModel){
        this.printService.printRequestOutPut(outPut);
    }
}
