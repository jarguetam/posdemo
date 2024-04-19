import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { PayCondition } from 'src/app/models/paycondition';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { CustomerBrowserComponent } from '../../browser/customer/customer-browser/customer-browser.component';
import { PaymentMetodModel } from '../../common/models/payment-metod-model';
import { PaymentMetodDialogComponent } from '../../common/payment-metod-dialog/payment-metod-dialog.component';
import { CustomerModel } from '../../customers/models/customer';
import { PaymentDetailModel } from '../../purchase-payment/models/payment-detail-model';
import { DocumentSaleModel } from '../../sale/models/document-model';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { SalesInvoiceDialogComponent } from '../sales-invoice-dialog/sales-invoice-dialog.component';
import { PaymentSalesService } from '../service/payment-sales.service';
import { SellerModel } from '../../seller/models/seller';
import { SellerService } from '../../seller/service/seller.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { tap } from 'rxjs';
import { DbLocalService } from 'src/app/service/db-local.service';
import { PrintEscPaymentService } from '../service/print-esc-payment.service';

@Component({
    selector: 'app-sales-payment-dialog',
    templateUrl: './sales-payment-dialog.component.html',
    styleUrls: ['./sales-payment-dialog.component.scss'],
})
export class SalesPaymentDialogComponent implements OnInit {
    @Output() PaymentSalesModify = new EventEmitter<PaymentSaleModel[]>();
    @ViewChildren('sumApplied') quantityInputs: QueryList<any>;
    @ViewChild(CustomerBrowserComponent)
    CustomerBrowser: CustomerBrowserComponent;
    @ViewChild(SalesInvoiceDialogComponent)
    SalesInvoiceDialog: SalesInvoiceDialogComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    payment: PaymentSaleModel = new PaymentSaleModel();
    isAdd: boolean;
    isTax: boolean = false;
    disabled: boolean = false;
    formSales: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    detail: PaymentDetailModel[] = [];
    payConditionList: PayCondition[];
    sellerList: SellerModel[];
    status: boolean;
    currentState!: ConnectionState;

    constructor(
        private formBuilder: FormBuilder,
        private paymentService: PaymentSalesService,
        private authService: AuthService,
        private commonService: CommonService,
        private sellerService: SellerService,
        private connectionService: ConnectionService,
        private db_local: DbLocalService,
        private printService: PrintEscPaymentService,
    ) {
        this.usuario = this.authService.UserValue;
    }
    ngOnInit(): void {
        this.connectionService
        .monitor()
        .pipe(
            tap((newState: ConnectionState) => {
                this.currentState = newState;
                if (this.currentState.hasNetworkConnection) {
                    this.status = true;
                } else {
                    this.status = false;
                }
            })
        )
        .subscribe();
    }

    showDialog(paymentNew: PaymentSaleModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = isAdd?false:true;
        this.payment = paymentNew;
        this.doctotal = paymentNew.docTotal;
        this.detail = paymentNew.detail;
        this.doctotal = paymentNew.docTotal;
        this._getData();
        this._createFormBuild();
    }

    async _getData() {
        try {
            // this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            this.sellerList = await this.sellerService.getSeller();
            //Messages.closeLoading();
            // this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }
    _createFormBuild() {
        this.formSales = this.formBuilder.group({
            docId: [this.payment.docId ?? 0],
            customerId: [this.payment.customerId ?? 0],
            customerCode: [
                this.payment.customerCode ?? '',
                Validators.required,
            ],
            customerName: [
                this.payment.customerName ?? '',
                Validators.required,
            ],
            payConditionId: [
                this.payment.payConditionId ?? '',
                Validators.required,
            ],
            comment: [
                this.payment.comment ?? 'Pago Recibido',
                Validators.required,
            ],
            reference: [this.payment.reference ?? '', Validators.required],
            cashSum: [this.payment.cashSum ?? 0],
            chekSum: [this.payment.chekSum ?? 0],
            transferSum: [this.payment.transferSum ?? 0],
            cardSum: [this.payment.cardSum ?? 0],
            docTotal: [this.payment.docTotal ?? 0],
            createBy: [this.payment.createBy ?? this.usuario.userId],
            detail: [[]],
            docDate: [this.payment.docDate],
            sellerId: [this.payment.sellerId ?? this.usuario.sellerId,
                Validators.required,],
        });
        this.formSales.controls['payConditionId'].disable({ onlySelf: false });
        this.formSales.controls['customerCode'].disable({ onlySelf: false });
        this.formSales.controls['customerName'].disable({ onlySelf: false });
    }

    new() {
        this.payment = undefined;
        this.formSales = undefined;
    }

    showDialogCustomer() {
        this.CustomerBrowser.showDialog(this.usuario.sellerId);
    }

    async browserCustomer(customer: CustomerModel) {
        this.payment.customerId = customer.customerId;
        this.payment.customerCode = customer.customerCode;
        this.payment.customerName = customer.customerName;
        this.payment.payConditionId = customer.payConditionId;
        this.payment.payConditionName = customer.payConditionName;
        await this.showSalesInvoice(customer.customerId);
        this._createFormBuild();
    }

    showSalesInvoice(idCustomer: number) {
        this.SalesInvoiceDialog.showDialog(idCustomer);
    }

    selectInvoice(invoice: DocumentSaleModel[]) {
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
                sumApplied: document.balance,
                balance: document.balance,
            })
        );
        this.detail = paymentDetails;
        this.calculateTotal();
        this.formSales.controls['reference'].setValue(
            'Facturas: ' + this.detail.map((x) => x.invoiceId).toString()
        );
        setTimeout(() => {
            const lastQuantityInput = this.quantityInputs.last;
            if (lastQuantityInput) {
                lastQuantityInput.nativeElement.focus();
            }
        }, 500);
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
            );
        }, 500);
    }

    async addMetod() {
        await this.PaymentMetodDialog.showDialog(this.doctotal);
    }

    async add() {
        if (this.formSales.valid) {
            try {
                const newEntry = {
                    ...this.formSales.value,
                    docId: 0,
                    detail: this.detail,
                    docTotal: this.doctotal,
                    docDate: new Date(Date.now()),
                    customerCode: this.formSales.controls['customerCode'].value,
                    customerName: this.formSales.controls['customerName'].value,
                    payConditionId: this.formSales.controls['payConditionId'].value,
                    cashSum: Number(this.doctotal),
                    chekSum: this.payment.chekSum,
                    transferSum: this.payment.transferSum,
                    cardSum: this.payment.cardSum,
                };
                this.detail = [];
                this.doctotal = 0;
                Messages.loading('Agregando', 'Agregando pago de factura de venta');
                if (this.status) {
                    let payment = await this.paymentService.addPaymentSales(newEntry);
                    await this.deleteOrUpdate(newEntry);
                    this.PaymentSalesModify.emit(payment);
                    this.formSales.controls['reference'].setValue('');
                    await this.printService.printInvoice(newEntry);
                    this.display = false;
                    Messages.closeLoading();
                } else {
                    await this.db_local.table('payment').add(newEntry);
                    let paymentOffline = await this.db_local.payment.toArray();
                    await this.deleteOrUpdate(newEntry);
                    await this.printService.printInvoice(newEntry);
                    this.PaymentSalesModify.emit(paymentOffline);
                    this.formSales.controls['reference'].setValue('');
                    this.display = false;
                    Messages.closeLoading();
                }
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    private async deleteOrUpdate(newEntry: any) {
        for (const invoice of newEntry.detail) {
            try {
                let inv = await this.db_local.invoiceSeller
                    .where('docId')
                    .equals(invoice.invoiceId)
                    .toArray();
                inv[0].paidToDate = invoice.sumApplied;
                inv[0].balance = inv[0].balance - invoice.sumApplied;
                if (inv[0].balance <= 0) {
                    await this.db_local.invoiceSeller.delete(inv[0].id);
                } else {
                    await this.db_local.invoiceSeller.update(inv[0].id, inv[0]);
                }
            } catch (ex) {
                Messages.Toas('Advertencia: ' + ex);
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
        if (this.formSales.valid) {
            try {
                Messages.loading('Agregando', 'Editando factura de compra');
                let newEntry = this.formSales.value as PaymentSaleModel;
                let newLine = this.payment.detail.filter(
                    (x) => x.docDetailId == 0
                );
                newLine.forEach((x) => (x.docId = newEntry.docId));
                this.detail.push(...newLine);
                newEntry.detail = this.detail;
                newEntry.docTotal = this.doctotal;
                let payment = await this.paymentService.updatePaymentSales(
                    newEntry
                );
                //this.printService.printInvoice(payment[0]);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.PaymentSalesModify.emit(payment);
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
                let newEntry = this.formSales.value as PaymentSaleModel;
                let payment = await this.paymentService.cancelPaymentSales(
                    newEntry.docId
                );
                this.PaymentSalesModify.emit(payment);
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
