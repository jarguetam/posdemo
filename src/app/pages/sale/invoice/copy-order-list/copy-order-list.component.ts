import { SalesService } from './../../services/sales.service';
import { DocumentSaleModel } from './../../models/document-model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { SyncService } from 'src/app/service/sync.service';

@Component({
  selector: 'app-copy-order-sales-list',
  templateUrl: './copy-order-list.component.html',
  styleUrls: ['./copy-order-list.component.scss']
})
export class CopyOrderSaleListComponent implements OnInit {
    @Output() OrderSelect = new EventEmitter<DocumentSaleModel>();
    loading: boolean = false;
    title: string = 'Listado de pedidos de venta';
    orderList: DocumentSaleModel[];
    order: DocumentSaleModel;
    display: boolean = false;
    usuario: User;

    constructor(
        private orderServices: SalesService,
        private auth: AuthService,
        private stateService: SyncService
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit() {
        if(this.stateService.status){
            this.search();
        }
    }


    async search() {
        try {
            this.loading = true;
            this.orderList = await this.orderServices.getOrderActive();
            if(this.usuario.roleId !== 1){
                this.orderList = this.orderList.filter(x=> x.sellerId == this.usuario.sellerId);
            }
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    selectOrder(c: DocumentSaleModel) {
        this.order = c;
        this.order.docReference = this.order.docId;
        this.OrderSelect.emit(this.order);
        this.display = false;
        this.order = new DocumentSaleModel();
    }

    showDialog() {
        this.search();
        this.display = true;
    }


}
