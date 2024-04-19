import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { DocumentModel } from '../../purchase/models/document';
import { OrderPurchaseService } from '../../purchase/orders/services/order.service';

@Component({
  selector: 'app-purchase-invoice-dialog',
  templateUrl: './purchase-invoice-dialog.component.html',
  styleUrls: ['./purchase-invoice-dialog.component.scss']
})
export class PurchaseInvoiceDialogComponent implements OnInit {
    @Output() InvoiceSelect = new EventEmitter<DocumentModel[]>();
    loading: boolean = false;
    title: string = 'Listado de facturas de compra';
    orderList: DocumentModel[];
    selected: DocumentModel[] = [];
    order: DocumentModel;
    display: boolean = false;
    selectTotal: number=0;

    constructor(
        private orderServices: OrderPurchaseService,
    ) {}

    ngOnInit() {
       // this.search();
    }


    async search(idSupplier: number) {
        try {
            this.display = true;
            this.loading = true;
            this.orderList = await this.orderServices.getInvoiceActiveSupplier(idSupplier);
            if (this.orderList.length==0) {
               await Messages.warning("Advertencia", "Este proveedor no tiene facturas pendientes de pago.");
                this.display = false;
            }
            //Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    selectOrder() {
        if (this.selected.length === 0) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar al menos un item.'
            );
        }else{
            this.InvoiceSelect.emit(this.selected);
            this.display = false;
            this.order = new DocumentModel();
            this.selectTotal =0;
        }
       // this.order = c;

    }

    calculateTotal(){
        this.selectTotal =  this.selected.reduce(
            (acumulador, producto) => acumulador + producto.balance,
            0
        );
    }

    showDialog(idSupplier: number) {
        this.selectTotal =0;
        this.selected = [];
        this.display = true;
        this.search(idSupplier);
    }

}
