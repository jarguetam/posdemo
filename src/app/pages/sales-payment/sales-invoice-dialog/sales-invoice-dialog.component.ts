import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { DocumentSaleModel } from '../../sale/models/document-model';
import { SalesService } from '../../sale/services/sales.service';

@Component({
  selector: 'app-sales-invoice-dialog',
  templateUrl: './sales-invoice-dialog.component.html',
  styleUrls: ['./sales-invoice-dialog.component.scss']
})
export class SalesInvoiceDialogComponent implements OnInit {
    @Output() InvoiceSelect = new EventEmitter<DocumentSaleModel[]>();
    loading: boolean = false;
    title: string = 'Listado de facturas de venta';
    orderList: DocumentSaleModel[];
    selected: DocumentSaleModel[] = [];
    order: DocumentSaleModel;
    display: boolean = false;
    selectTotal: number=0;

    constructor(
        private orderServices: SalesService,
    ) {}

    ngOnInit() {
       // this.search();
    }
    async search(idCustomer: number) {
        try {
            this.display = true;
            this.loading = true;

            const orderList = await this.orderServices.getInvoiceActiveCustomer(idCustomer);
            const uniqueOrdersId = new Set<number>();

            this.orderList = orderList.filter(item => {
                if (uniqueOrdersId.has(item.docId)) return false;
                uniqueOrdersId.add(item.docId);
                return true;
            });

            if (this.orderList.length === 0) {
                await Messages.warning("Advertencia", "Este cliente no tiene facturas pendientes de pago.");
                this.display = false;
            }

            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    getTimeDifference(dueDate: Date): string {
        const currentDate = new Date();
        const timeDiff = new Date(dueDate).getTime() - currentDate.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return `${days}`;
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
            this.order = new DocumentSaleModel();
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

    showDialog(idCustomer: number) {
        this.selectTotal =0;
        this.selected = [];
        this.display = true;
        this.search(idCustomer);
    }

}
