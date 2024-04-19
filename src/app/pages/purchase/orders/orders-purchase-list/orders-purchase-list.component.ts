import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentModel } from './../../models/document';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { OrdersPurchaseDialogComponent } from '../orders-purchase-dialog/orders-purchase-dialog.component';
import { OrderPurchaseService } from '../services/order.service';
import { PrintOrderPurchaseService } from '../services/print-order-purchase.service';

@Component({
  selector: 'app-orders-purchase-list',
  templateUrl: './orders-purchase-list.component.html',
  styleUrls: ['./orders-purchase-list.component.scss']
})
export class OrdersPurchaseListComponent implements OnInit {
    @ViewChild(OrdersPurchaseDialogComponent)
    OrdersPurchaseDialog: OrdersPurchaseDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de pedidos de compra';
    orderList: DocumentModel[];
    formFilter: FormGroup;
    constructor(
        private orderServices: OrderPurchaseService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintOrderPurchaseService
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
            this.orderList = await this.orderServices.getOrderByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    orderModify(order: DocumentModel[]) {
        this.orderList = order;
    }

    addOrder() {
        if(!this.auth.hasPermission("btn_add")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso.")
             return;
           }
        this.OrdersPurchaseDialog.showDialog(new DocumentModel(), true);
    }

    editOrder(order: DocumentModel){
        if(!this.auth.hasPermission("btn_edit")){
            Messages.warning("No tiene acceso", "No puede editar pedidos, por favor solicite el acceso.")
            return;
          }
       this.OrdersPurchaseDialog.showDialog(order, false);
    }

    viewOrder(order: DocumentModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso.")
             return;
           }
        this.OrdersPurchaseDialog.showDialog(order, false);
    }


    print(order: DocumentModel){
       this.printService.printOrder(order);
    }

}
