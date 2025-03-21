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
import { combineLatest, tap } from 'rxjs';
import { DbLocalService } from 'src/app/service/db-local.service';
import { PrintEscPaymentService } from '../service/print-esc-payment.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

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
    isOffline: boolean = false;
    offlineId: number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private paymentService: PaymentSalesService,
        private authService: AuthService,
        private commonService: CommonService,
        private sellerService: SellerService,
        private connectionService: ConnectionService,
        private db_local: DbLocalService,
        private printService: PrintEscPaymentService,
        private router: Router,
        private auth: AuthService,
        private connectionStateService: ConnectionStateService
    ) {
        this.usuario = this.authService.UserValue;
        // Combinar el monitor de red con el estado de offline forzado
        combineLatest([
            this.connectionService.monitor(),
            this.connectionStateService.forceOffline$,
        ])
            .pipe(
                tap(([networkState, forceOffline]) => {
                    this.currentState = networkState;
                    // El status es true solo si hay conexión de red Y no está forzado el modo offline
                    this.status =
                        networkState.hasNetworkConnection && !forceOffline;

                    // Log para debugging
                    console.log(
                        `Network: ${networkState.hasNetworkConnection}, Force Offline: ${forceOffline}, Final Status: ${this.status}`
                    );
                })
            )
            .subscribe();
    }
    ngOnInit(): void {}

    showDialog(paymentNew: PaymentSaleModel, isAdd: boolean) {
        if (paymentNew.id != null && paymentNew.id !== 0) {
            this.isOffline = true;
            this.offlineId = paymentNew.id;
        }
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = isAdd ? false : true;
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
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
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
            docDate: [this.payment.docDate ?? localDateString],
            sellerId: [
                this.payment.sellerId ?? this.usuario.sellerId,
                Validators.required,
            ],
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
                invoiceReference: document.uuid,
                invoiceDate: document.docDate,
                dueDate: document.dueDate,
                subTotal: document.subTotal,
                taxTotal: document.tax,
                discountTotal: document.discountsTotal,
                lineTotal: document.docTotal,
                isDelete: false,
                sumApplied: document.balance,
                balance: document.balance,
                reference: document.reference,
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
                const invalidPayment = this.detail.some(
                    (item) => item.sumApplied > item.balance
                );
                if (invalidPayment) {
                    Messages.warning(
                        'Error',
                        'No puede aplicar un pago mayor al saldo pendiente.'
                    );
                    return;
                }
                const newEntry = {
                    ...this.formSales.value,
                    docId: 0,
                    detail: this.detail,
                    docTotal: this.doctotal,

                    customerCode: this.formSales.controls['customerCode'].value,
                    customerName: this.formSales.controls['customerName'].value,
                    payConditionId:
                        this.formSales.controls['payConditionId'].value,
                    cashSum: Number(this.doctotal),
                    chekSum: this.payment.chekSum,
                    transferSum: this.payment.transferSum,
                    cardSum: this.payment.cardSum,
                };
                this.detail = [];
                this.doctotal = 0;
                const MIN_DATE = new Date('0001-01-01T00:00:00Z'); // 01/01/0001
                newEntry.docDate = MIN_DATE;
                newEntry.uuid = uuidv4();
                Messages.loading(
                    'Agregando',
                    'Agregando pago de factura de venta'
                );

                if (this.status) {
                    newEntry.offline = false;
                    let payment = await this.paymentService.addPaymentSales(
                        newEntry
                    );
                    await this.deleteOrUpdate(newEntry);
                    // this.PaymentSalesModify.emit(payment);
                    this.formSales.controls['reference'].setValue('');

                    Messages.closeLoading();
                    await this.printService.printInvoice(newEntry);
                    this.PaymentSalesModify.emit(payment);
                    this.display = false;
                } else {
                    let correlative = await this.db_local.correlative.toArray();
                    const currentDate = new Date();
                    const hondurasOffset = -6 * 60; // Honduras tiene una diferencia horaria de -6 horas respecto a UTC
                    const localDate = new Date(
                        currentDate.getTime() +
                            (currentDate.getTimezoneOffset() + hondurasOffset) *
                                60000
                    );
                    newEntry.docDate = currentDate;
                    newEntry.offline = true;

                    await this.db_local
                        .table('payment')
                        .add(newEntry)
                        .then(async (data) => {
                            await this.updateCorrelative(
                                correlative[0].correlativeId
                            );
                        });
                    let paymentOffline = await this.db_local.payment.toArray();
                    await this.deleteOrUpdate(newEntry);
                    newEntry.docId = correlative[0].currentCorrelative + 1;
                    //this.PaymentSalesModify.emit(paymentOffline);
                    this.formSales.controls['reference'].setValue('');
                    Messages.closeLoading();

                    await this.printService.printInvoice(newEntry);
                    this.PaymentSalesModify.emit(paymentOffline);
                    this.display = false;
                }
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async updateCorrelative(correlativeId: number) {
        await this.db_local.correlative
            .where('correlativeId')
            .equals(correlativeId)
            .modify((x) => {
                x.currentCorrelative = x.currentCorrelative + 1;
            });
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
                let invAccount = await this.db_local.customerAccountModel
                    .where('invoiceNumber')
                    .equals(invoice.invoiceId)
                    .toArray();
                invAccount[0].paidToDate = invoice.sumApplied;
                invAccount[0].balance =
                    invAccount[0].balance - invoice.sumApplied;
                if (invAccount[0].balance <= 0) {
                    await this.db_local.customerAccountModel.delete(
                        invAccount[0].invoiceNumber
                    );
                    await this.db_local.customers
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .modify((x) => {
                        x.limitInvoiceCredit +=1;
                    });
                } else {
                    await this.db_local.customerAccountModel.update(
                        invAccount[0].id,
                        invAccount[0]
                    );
                }

                await this.db_local.customers
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .modify((x) => {
                        x.balance = x.balance - invoice.sumApplied;
                    });
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
        if (!this.auth.hasPermission('btn_editar_cobro')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar por favor solicite el acceso.'
            );
            return;
        }
        if (this.formSales.valid) {
            try {
                Messages.loading('Agregando', 'Editando pago de cliente');
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
        if (!this.auth.hasPermission('btn_anular_cobro')) {
            Messages.warning(
                'No tiene acceso',
                'No puede anular por favor solicite el acceso.'
            );
            return;
        }
        let cancel = await Messages.question(
            'Cancelacion',
            'Cancelar esta pago es irreversible. ¿Seguro desea continuar?'
        );
        if (cancel) {
            try {
                debugger;
                if (this.isOffline) {
                    await this.db_local.payment.delete(this.offlineId);
                    let result =
                        await this.paymentService.getPaymentSalesByDate(
                            this.formSales.value.docDate,
                            this.formSales.value.docDate
                        );
                    await this.router.navigate(['/listado-cobros-clientes'], {
                        state: {},
                    });
                } else {
                    let newEntry = this.formSales.value as PaymentSaleModel;
                    let payment = await this.paymentService.cancelPaymentSales(
                        newEntry.docId
                    );
                    this.PaymentSalesModify.emit(payment);
                }
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
