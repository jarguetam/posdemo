import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEntryDialogComponent } from '../inventory-entry-dialog/inventory-entry-dialog.component';
import { InventoryEntryModel } from './../models/inventory-entry';
import { InventoryEntryService } from './../services/inventory-entry.service';
import { Messages } from 'src/app/helpers/messages';
import { PrintEntryService } from '../services/print-entry.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-inventory-entry-list',
    templateUrl: './inventory-entry-list.component.html',
    styleUrls: ['./inventory-entry-list.component.scss'],
})
export class InventoryEntryListComponent implements OnInit {
    @ViewChild(InventoryEntryDialogComponent)
    InventoryEntryDialog: InventoryEntryDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de entradas de mercancias';
    entryList: InventoryEntryModel[];
    formFilter: FormGroup;
    constructor(
        private entryServices: InventoryEntryService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintEntryService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
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
            this.entryList = await this.entryServices.getByDate(
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

    entryModify(entry: InventoryEntryModel[]) {
        this.entryList = entry;
    }

    addEntry() {
        if(!this.auth.hasPermission("btn_add")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.InventoryEntryDialog.showDialog(new InventoryEntryModel(), true);
    }

    viewEntry(entry: InventoryEntryModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryEntryDialog.showDialog(entry, false);
    }

    print(entry: InventoryEntryModel){
        this.printService.printRequestEntry(entry);
    }
}
