import { DocumentModel } from './../../purchase/models/document';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { PaymentModel } from '../models/payment-model';
import { PurchaseInvoiceDialogComponent } from '../purchase-invoice-dialog/purchase-invoice-dialog.component';
import { PurchasePaymentDialogComponent } from '../purchase-payment-dialog/purchase-payment-dialog.component';

import { PaymentPurchaseService } from '../service/payment-purchase.service';
import { PrintPaymentPurchaseService } from '../service/print-payment-purchase.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-payment-list',
  templateUrl: './purchase-payment-list.component.html',
  styleUrls: ['./purchase-payment-list.component.scss']
})
export class PurchasePaymentListComponent implements OnInit {
    @ViewChild(PurchasePaymentDialogComponent)
    PurchasePaymentDialog: PurchasePaymentDialogComponent;
    @ViewChild(PurchaseInvoiceDialogComponent)
    PurchaseInvoiceDialog: PurchaseInvoiceDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de pagos de facturas de compra';
    paymentList: PaymentModel[];
    formFilter: FormGroup;
    constructor(
        private paymentService: PaymentPurchaseService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
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
            this.paymentList = await this.paymentService.getPaymentPurchaseByDate(
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

    paymentModify(payment: PaymentModel[]) {
        this.paymentList = payment;
    }

    addPayment() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        this.PurchasePaymentDialog.showDialog(new PaymentModel(), true);
    }

    editPayment(payment: PaymentModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
        this.PurchasePaymentDialog.showDialog(payment, false);
    }

    viewPayment(payment: PaymentModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
       // this.PurchasePaymentDialog.showDialog(payment, false);
    }

    print(payment: PaymentModel) {
       // this.printService.printPayment(payment);
    }

    showInvoicePurchase() {
      //  this.PurchasePaymentDialog.showDialog();
    }

    invoiceSelected(order: DocumentModel[]) {
      //  order.docReference = order.docId;
      //  this.PurchasePaymentDialog.showDialog(order, true);
    }
}
