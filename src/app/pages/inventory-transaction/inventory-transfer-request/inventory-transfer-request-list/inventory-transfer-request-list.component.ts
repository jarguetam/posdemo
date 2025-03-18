import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryTransferRequestDialogComponent } from '../inventory-transfer-request-dialog/inventory-transfer-request-dialog.component';
import { InventoryRequestTransfer } from '../models/inventory-request-transfer';
import { InventoryTransferRequestService } from '../service/inventory-transfer-request.service';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { PrintInventoryRequestService } from '../service/print-request.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory-transfer-request-list',
  templateUrl: './inventory-transfer-request-list.component.html',
  styleUrls: ['./inventory-transfer-request-list.component.scss']
})
export class InventoryTransferRequestListComponent implements OnInit {

    @ViewChild(InventoryTransferRequestDialogComponent)
    InventoryTransferDialog: InventoryTransferRequestDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de mis solicitudes de transferencia de mercancias';
    transferList: InventoryRequestTransfer[];
    formFilter: FormGroup;
    usuario: User;

    constructor(
        private transferServices: InventoryTransferRequestService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintInventoryRequestService,
        private datePipe: DatePipe,
    ) {
        this.usuario = this.auth.UserValue;
    }

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
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd'),
                this.usuario.userId
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error);
        }
    }

    transferModify(transfer: InventoryRequestTransfer[]) {
        this.transferList = transfer;
    }

    addTransfer() {
        if(!this.auth.hasPermission("btn_add_request_transfer")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.InventoryTransferDialog.showDialog(new InventoryRequestTransfer(), true);
    }

    viewTransfer(transfer: InventoryRequestTransfer) {
        if(!this.auth.hasPermission("btn_edit_request_transfer")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.InventoryTransferDialog.showDialog(transfer, false);
    }

    editTransfer(transfer: InventoryRequestTransfer) {
        if(!this.auth.hasPermission("btn_edit_request_transfer")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }

        this.InventoryTransferDialog.showDialog(transfer, false);
    }

    print(transfer: InventoryRequestTransfer){
       this.printService.printInventoryRequest(transfer);
    }

}
