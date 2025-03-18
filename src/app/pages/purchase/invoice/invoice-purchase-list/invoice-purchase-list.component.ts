import { CopyOrderListComponent } from './../copy-order-list/copy-order-list.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentModel } from '../../models/document';
import { OrderPurchaseService } from '../../orders/services/order.service';
import { InvoicePurchaseDialogComponent } from '../invoice-purchase-dialog/invoice-purchase-dialog.component';
import { PrintInvoicePurchaseService } from '../service/print-invoice-purchase.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-invoice-purchase-list',
    templateUrl: './invoice-purchase-list.component.html',
    styleUrls: ['./invoice-purchase-list.component.scss'],
})
export class InvoicePurchaseListComponent implements OnInit {
    @ViewChild(InvoicePurchaseDialogComponent)
    InvoicePurchaseDialog: InvoicePurchaseDialogComponent;
    @ViewChild(CopyOrderListComponent)
    CopyOrderList: CopyOrderListComponent;
    loading: boolean = false;
    title: string = 'Listado de facturas de compra';
    invoiceList: DocumentModel[];
    formFilter: FormGroup;
    constructor(
        private invoiceService: OrderPurchaseService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintInvoicePurchaseService,
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
            this.invoiceList = await this.invoiceService.getInvoiceByDate(
                this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd')
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    invoiceModify(invoice: DocumentModel[]) {
        this.invoiceList = invoice;
    }

    addInvoice() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        this.InvoicePurchaseDialog.showDialog(new DocumentModel(), true);
    }

    editInvoice(invoice: DocumentModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
        this.InvoicePurchaseDialog.showDialog(invoice, false);
    }

    viewInvoice(invoice: DocumentModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
        this.InvoicePurchaseDialog.showDialog(invoice, false, true);
    }

    print(invoice: DocumentModel) {
        this.printService.printInvoice(invoice);
    }

    showOrders() {
        this.CopyOrderList.showDialog();
    }

    orderSelected(order: DocumentModel) {
        order.docReference = order.docId;
        this.InvoicePurchaseDialog.showDialog(order, true);
    }
}
