import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryTransferDialogComponent } from '../inventory-transfer-dialog/inventory-transfer-dialog.component';
import { InventoryTransferModel } from '../models/inventory-transfer';
import { InventoryTransferService } from '../services/inventory-transfer.service';
import { PrintTransferService } from '../services/print-transfer.service';
import { InventoryTransferRequestToCompleteComponent } from '../../inventory-transfer-request/inventory-transfer-request-to-complete/inventory-transfer-request-to-complete.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory-transfer-list',
  templateUrl: './inventory-transfer-list.component.html',
  styleUrls: ['./inventory-transfer-list.component.scss']
})
export class InventoryTransferListComponent implements OnInit {
    @ViewChild(InventoryTransferDialogComponent)
    InventoryTransferDialog: InventoryTransferDialogComponent;
    @ViewChild(InventoryTransferRequestToCompleteComponent)
    InventoryTransferRequestToComplete: InventoryTransferRequestToCompleteComponent;
    loading: boolean = false;
    title: string = 'Listado de transferencia de mercancias';
    transferList: InventoryTransferModel[];
    formFilter: FormGroup;
    constructor(
        private transferServices: InventoryTransferService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintTransferService,
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
            this.transferList = await this.transferServices.getByDate(
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

    transferModify(transfer: InventoryTransferModel[]) {
        this.transferList = transfer;
    }

    addTransfer() {
        if(!this.auth.hasPermission("btn_add")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.InventoryTransferDialog.showDialog(new InventoryTransferModel(), true);
    }

    viewTransfer(transfer: InventoryTransferModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryTransferDialog.showDialog(transfer, false);
    }

    print(transfer: InventoryTransferModel){
        this.printService.printRequestTransfer(transfer);
    }

    copyToRequest(){
        this.InventoryTransferRequestToComplete.showDialog();
    }

    orderSelected(transfer: InventoryTransferModel) {
        transfer.transferRequestId = transfer.transferRequestId;
        this.InventoryTransferDialog.showDialog(transfer, true);
    }
}
