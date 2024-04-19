import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryRequestTransfer } from '../models/inventory-request-transfer';
import { InventoryTransferRequestService } from '../service/inventory-transfer-request.service';

@Component({
    selector: 'app-inventory-transfer-request-to-complete',
    templateUrl: './inventory-transfer-request-to-complete.component.html',
    styleUrls: ['./inventory-transfer-request-to-complete.component.scss'],
})
export class InventoryTransferRequestToCompleteComponent implements OnInit {
    @Output() RequestSelect = new EventEmitter<InventoryRequestTransfer>();
    loading: boolean = false;
    title: string = 'Listado de solicitudes de transferencia de mercancias';
    transferList: InventoryRequestTransfer[];
    request: InventoryRequestTransfer;
    usuario: User;
    display: boolean = false;

    constructor(
        private transferServices: InventoryTransferRequestService,
        private auth: AuthService,
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit() {}

    async search() {
        try {
            this.loading = true;
            this.transferList = await this.transferServices.getToComplete();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error);
        }
    }

    selectOrder(c: InventoryRequestTransfer) {
        this.request = c;
        this.request.transferRequestId = this.request.transferRequestId;
        this.RequestSelect.emit(this.request);
        this.display = false;
        this.request = new InventoryRequestTransfer();
    }

    showDialog() {
        this.search();
        this.display = true;
    }
}
