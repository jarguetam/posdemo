import { DocumentSaleModel } from './../../models/document-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { OrdersSaleDialogComponent } from '../orders-sale-dialog/orders-sale-dialog.component';
import { SalesService } from '../../services/sales.service';
import { PrintOrderSaleService } from '../../services/print-order-sale.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { DbLocalService } from 'src/app/service/db-local.service';
import { PrintEscPosService } from '../../services/print-esc-pos.service';

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
        private printService: PrintEscPosService,
        private router: Router,
        private db: DbLocalService,
    ) {
        this._createFormBuild();
        this.search();
        this.usuario = this.auth.UserValue;
    }

    ngOnInit() {
        this.orderServices.isSync$.subscribe(async (isSync: boolean) => {
            this.loading = isSync;
            if(this.loading === false){
              await this.search();
            }
        });

        this._createFormBuild();

    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        this.formFilter = this.formBuilder.group({
            from: [localDateString, Validators.required],
            to: [localDateString, Validators.required],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.orderList = await this.orderServices.getOrderByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );

            if (this.usuario.roleId != 1) {
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

    async addOrder() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }

        await this.router.navigate(['/listado-pedidos/pedido'], {
            state: {},
        });
    }

    async editOrder(order: DocumentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
       // this.InvoiceSaleDialog.showDialog(invoice, false);
       await this.router.navigate(['/listado-pedidos/pedido'], {
        state: {order},
    });
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
        this.printService.printInvoice(order, 'Pedido');
    }

    async syncOrder(order: DocumentSaleModel) {

        try {
            //const MIN_DATE = new Date('0001-01-01T00:00:00Z'); // 01/01/0001
            //order.docDate = MIN_DATE;
            const currentDate = new Date();
            const localDateString = new Date(
                currentDate.getTime() -
                    currentDate.getTimezoneOffset() * 60000
            );
            order.docDate = localDateString;
            Messages.loading('Agregando', 'Agregando pedido de venta');
            await this.orderServices.addOrder(order);

            await this.db.orderSales.delete(order.id);
            await this.search();
            Messages.closeLoading();
        } catch (ex) {
            if(ex.error.message=="Error: Esta pedido ya existe en la base de datos. UUID"){
                await this.db.orderSales.delete(order.id);
                this.search();
            }
            Messages.closeLoading();
            Messages.warning('Advertencia', ex.error.message);
        }
    }

}
