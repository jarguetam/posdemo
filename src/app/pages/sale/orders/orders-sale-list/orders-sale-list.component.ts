import { DocumentSaleModel } from './../../models/document-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { OrdersSaleDialogComponent } from '../orders-sale-dialog/orders-sale-dialog.component';
import { SalesService } from '../../services/sales.service';
import { PrintOrderSaleService } from '../../services/print-order-sale.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-orders-sale-list',
    templateUrl: './orders-sale-list.component.html',
    styleUrls: ['./orders-sale-list.component.scss'],
})
export class OrdersSaleListComponent implements OnInit {
    @ViewChild(OrdersSaleDialogComponent)
    OrdersSaleDialog: OrdersSaleDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de pedidos de venta';
    orderList: DocumentSaleModel[];
    formFilter: FormGroup;
    usuario: User;
    constructor(
        private orderServices: SalesService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintOrderSaleService
    ) {
        this.usuario = this.auth.UserValue;
    }

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

            if (this.usuario.role != 'Administrador') {
                this.orderList = this.orderList.filter(
                    (x) => x.sellerId === this.usuario.sellerId
                );
            }
            
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    orderModify(order: DocumentSaleModel[]) {
        this.orderList = order;
    }

    addOrder() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        this.OrdersSaleDialog.showDialog(new DocumentSaleModel(), true);
    }

    editOrder(order: DocumentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
        this.OrdersSaleDialog.showDialog(order, false);
    }

    viewOrder(order: DocumentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
        this.OrdersSaleDialog.showDialog(order, false);
    }

    print(order: DocumentSaleModel) {
        this.printService.printOrder(order);
    }
}
