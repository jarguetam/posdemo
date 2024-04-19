import { PaymentPurchaseService } from './../service/payment-purchase.service';
import {
    Component,
    OnInit,
    Output,
    ViewChild,
    EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { SupplierBrowserComponent } from '../../browser/supplier/supplier-browser/supplier-browser.component';
import { SupplierModel } from '../../suppliers/models/supplier';
import { PaymentModel } from '../models/payment-model';
import { PaymentDetailModel } from '../models/payment-detail-model';
import { PurchaseInvoiceDialogComponent } from '../purchase-invoice-dialog/purchase-invoice-dialog.component';
import { PayCondition } from 'src/app/models/paycondition';
import { CommonService } from 'src/app/service/common.service';
import { DocumentModel } from '../../purchase/models/document';
import { PaymentMetodDialogComponent } from '../../common/payment-metod-dialog/payment-metod-dialog.component';
import { PaymentMetodModel } from '../../common/models/payment-metod-model';

@Component({
    selector: 'app-purchase-payment-dialog',
    templateUrl: './purchase-payment-dialog.component.html',
    styleUrls: ['./purchase-payment-dialog.component.scss'],
})
export class PurchasePaymentDialogComponent implements OnInit {
    @Output() PaymentPurchaseModify = new EventEmitter<PaymentModel[]>();
    @ViewChild(SupplierBrowserComponent)
    SupplierBrowser: SupplierBrowserComponent;
    @ViewChild(PurchaseInvoiceDialogComponent)
    PurchaseInvoiceDialog: PurchaseInvoiceDialogComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    payment: PaymentModel = new PaymentModel();
    isAdd: boolean;
    isTax: boolean = false;
    disabled: boolean = false;
    formPurchase: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    detail: PaymentDetailModel[] = [];
    payConditionList: PayCondition[];

    constructor(
        private formBuilder: FormBuilder,
        private paymentService: PaymentPurchaseService,
        private authService: AuthService,
        private commonService: CommonService //private printService: PrintInvoicePurchaseService
    ) {
        this.usuario = this.authService.UserValue;
    }
    ngOnInit(): void {}

    showDialog(paymentNew: PaymentModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = false;
        this.payment = paymentNew;
        this.doctotal = paymentNew.docTotal;
        this.detail = paymentNew.detail;
        this.doctotal = paymentNew.docTotal;

        this._createFormBuild();
    }

    async _getData() {
        try {
            // this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            //Messages.closeLoading();
            // this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }
    _createFormBuild() {
        this.formPurchase = this.formBuilder.group({
            docId: [this.payment.docId ?? 0],
            supplierId: [this.payment.supplierId ?? 0],
            supplierCode: [
                this.payment.supplierCode ?? '',
                Validators.required,
            ],
            supplierName: [
                this.payment.supplierName ?? '',
                Validators.required,
            ],
            payConditionId: [
                this.payment.payConditionId ?? '',
                Validators.required,
            ],
            comment: [this.payment.comment ?? 'Pago efectuado'],
            reference: [this.payment.reference ?? '', Validators.required],
            cashSum: [this.payment.cashSum ?? 0],
            chekSum: [this.payment.chekSum ?? 0],
            transferSum: [this.payment.transferSum ?? 0],
            cardSum: [this.payment.cardSum ?? 0],
            docTotal: [this.payment.docTotal ?? 0],
            createBy: [this.payment.createBy ?? this.usuario.userId],
            detail: [[]],
            docDate: [this.payment.docDate],
        });
        this.formPurchase.controls['payConditionId'].disable({
            onlySelf: false,
        });
        this.formPurchase.controls['supplierCode'].disable({ onlySelf: false });
        this.formPurchase.controls['supplierName'].disable({ onlySelf: false });
    }

    new() {
        this.payment = undefined;
        this.formPurchase = undefined;
    }

    showDialogSupplier() {
        this.SupplierBrowser.showDialog();
    }

    async browserSupplier(supplier: SupplierModel) {
        this._getData();
        this.payment.supplierId = supplier.supplierId;
        this.payment.supplierCode = supplier.supplierCode;
        this.payment.supplierName = supplier.supplierName;
        this.payment.payConditionId = supplier.payConditionId;
        this.payment.payConditionName = supplier.payConditionName;
        await this.showPurchaseInvoice(supplier.supplierId);
        this._createFormBuild();
    }

    showPurchaseInvoice(idSupplier: number) {
        this.PurchaseInvoiceDialog.showDialog(idSupplier);
    }

    selectInvoice(invoice: DocumentModel[]) {
        const paymentDetails: PaymentDetailModel[] = invoice.map(
            (document) => ({
                docDetailId: 0,
                docId: 0,
                invoiceId: document.docId,
                invoiceReference: document.docId.toString(),
                invoiceDate: document.docDate,
                dueDate: document.dueDate,
                subTotal: document.subTotal,
                taxTotal: document.tax,
                discountTotal: document.discountsTotal,
                lineTotal: document.docTotal,
                isDelete: false,
                balance: document.balance,
                sumApplied: document.balance
            })
        );
        this.detail = paymentDetails;
        this.calculateTotal();
        this.formPurchase.controls['reference'].setValue(
            'Facturas: ' + this.detail.map((x) => x.invoiceId).toString()
        );
    }

    deleteLine(invoiceNum) {
        if (!this.isAdd) {
            this.detail.find((x) => x.invoiceId === invoiceNum).isDelete = true;
            this.payment.detail.find(
                (x) => x.invoiceId === invoiceNum
            ).isDelete = true;
            this.payment.detail = this.payment.detail.filter(
                (x) => x.isDelete == false
            );
        } else {
            this.payment.detail = this.detail.filter(
                (x) => x.invoiceId != invoiceNum
            );
        }
        this.detail = this.payment.detail;
        this.calculateTotal();
    }

    calculateTotal() {
        setTimeout(() => {
        this.doctotal = this.detail.reduce(
            (acumulador, producto) => acumulador + producto.sumApplied,
            0
        );}, 500);
    }

    async addMetod() {
        await this.PaymentMetodDialog.showDialog(this.doctotal);
    }

    async add() {
        if (this.formPurchase.valid) {
            try {
                let newEntry = this.formPurchase.value as PaymentModel;
                newEntry.docId = 0;
                newEntry.detail = this.detail;
                newEntry.docTotal = this.doctotal;
                newEntry.docDate = new Date(Date.now());
                newEntry.supplierCode =
                    this.formPurchase.controls['supplierCode'].value;
                newEntry.supplierName =
                    this.formPurchase.controls['supplierName'].value;
                newEntry.payConditionId =
                    this.formPurchase.controls['payConditionId'].value;
                newEntry.cashSum = Number(this.payment.cashSum);
                newEntry.chekSum = this.payment.chekSum;
                newEntry.transferSum = this.payment.transferSum;
                newEntry.cardSum = this.payment.cardSum;
                this.detail = [];
                this.doctotal = 0;
                Messages.loading(
                    'Agregando',
                    'Agregando pago de factura de compra'
                );
                let payment = await this.paymentService.addPaymentPurchase(
                    newEntry
                );
                //this.printService.printInvoice(payment[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.PaymentPurchaseModify.emit(payment);
                this.formPurchase.controls['reference'].setValue('');
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    selectPaymentMetod(metods: PaymentMetodModel) {
        this.payment.cashSum = metods.cashSum;
        this.payment.chekSum = metods.chekSum;
        this.payment.transferSum = metods.transferSum;
        this.payment.cardSum = metods.cardSum;
        this.add();
    }

    async edit() {
        if (this.formPurchase.valid) {
            try {
                Messages.loading('Agregando', 'Editando factura de compra');
                let newEntry = this.formPurchase.value as PaymentModel;
                let newLine = this.payment.detail.filter(
                    (x) => x.docDetailId == 0
                );
                newLine.forEach((x) => (x.docId = newEntry.docId));
                this.detail.push(...newLine);
                newEntry.detail = this.detail;
                newEntry.docTotal = this.doctotal;
                let payment = await this.paymentService.updatePaymentPurchase(
                    newEntry
                );
                //this.printService.printInvoice(payment[0]);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.PaymentPurchaseModify.emit(payment);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async cancelInvoice() {
        let cancel = await Messages.question(
            'Cancelacion',
            'Cancelar esta pago es irreversible. ¿Seguro desea continuar?'
        );
        if (cancel) {
            try {
                let newEntry = this.formPurchase.value as PaymentModel;
                let payment = await this.paymentService.cancelPaymentPurchase(
                    newEntry.docId
                );
                this.PaymentPurchaseModify.emit(payment);
                this.display = false;
                Messages.closeLoading();
                Messages.Toas('Cancelado Correctamente');
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print() {
        // this.printService.printInvoice(this.payment);
    }
}
