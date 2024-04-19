import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { SupplierModel } from 'src/app/pages/suppliers/models/supplier';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentModel } from '../../models/document';
import { OrderPurchaseService } from '../../orders/services/order.service';
import { PrintOrderPurchaseService } from '../../orders/services/print-order-purchase.service';

@Component({
  selector: 'app-copy-order-list',
  templateUrl: './copy-order-list.component.html',
  styleUrls: ['./copy-order-list.component.scss']
})
export class CopyOrderListComponent implements OnInit {
    @Output() OrderSelect = new EventEmitter<DocumentModel>();
    loading: boolean = false;
    title: string = 'Listado de pedidos de compra';
    orderList: DocumentModel[];
    order: DocumentModel;
    display: boolean = false;
    constructor(
        private orderServices: OrderPurchaseService,
    ) {}

    ngOnInit() {
        //this.search();
    }


    async search() {
        try {
            this.loading = true;
            this.orderList = await this.orderServices.getOrderActive();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    selectOrder(c: DocumentModel) {
        this.order = c;
        this.order.docReference = this.order.docId;
        this.OrderSelect.emit(this.order);
        this.display = false;
        this.order = new DocumentModel();
    }

    showDialog() {
        this.search();
        this.display = true;
    }

}
