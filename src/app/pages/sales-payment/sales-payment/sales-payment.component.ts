import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayCondition } from 'src/app/models/paycondition';
import { User } from 'src/app/models/user';
import { CustomerBrowserComponent } from '../../browser/customer/customer-browser/customer-browser.component';
import { PaymentMetodDialogComponent } from '../../common/payment-metod-dialog/payment-metod-dialog.component';
import { PaymentDetailModel } from '../../purchase-payment/models/payment-detail-model';
import { SellerModel } from '../../seller/models/seller';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { SalesInvoiceDialogComponent } from '../sales-invoice-dialog/sales-invoice-dialog.component';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { SellerService } from '../../seller/service/seller.service';
import { PaymentSalesService } from '../service/payment-sales.service';
import { Messages } from 'src/app/helpers/messages';
import { PaymentMetodModel } from '../../common/models/payment-metod-model';
import { CustomerModel } from '../../customers/models/customer';
import { DocumentSaleModel } from '../../sale/models/document-model';
import { SalesService } from '../../sale/services/sales.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sales-payment',
    templateUrl: './sales-payment.component.html',
    styleUrls: ['./sales-payment.component.scss'],
})
export class SalesPaymentComponent implements OnInit {
    private f10Pressed = false;
    private f7Pressed = false;
    title: string = 'Pagos recibidos';
    @Output() PaymentSalesModify = new EventEmitter<PaymentSaleModel[]>();
    @ViewChild(CustomerBrowserComponent)
    CustomerBrowser: CustomerBrowserComponent;
    @ViewChild(SalesInvoiceDialogComponent)
    SalesInvoiceDialog: SalesInvoiceDialogComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    @ViewChild('sumApplied ') sumApplied: ElementRef;
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
    orderList: DocumentSaleModel[];

    constructor(
        private formBuilder: FormBuilder,
        private paymentService: PaymentSalesService,
        private authService: AuthService,
        private commonService: CommonService,
        private sellerService: SellerService,
        private orderServices: SalesService,
        private renderer: Renderer2,
        private router: Router
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._getData();
        this._createFormBuild();
        this.isAdd = true;
        this.loading = false;
    }

    showDialog(paymentNew: PaymentSaleModel, isAdd: boolean) {
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
            this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            this.sellerList = await this.sellerService.getSeller();
            //Messages.closeLoading();
            this.loading = false;
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

    @HostListener('document:keydown.F8', ['$event']) onF8Keydown(
        event: KeyboardEvent
    ) {
        this.showDialogCustomer();
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
        // await this.showSalesInvoice(customer.customerId);
        this.orderList = await this.orderServices.getInvoiceActiveCustomer(
            customer.customerId
        );
        if (this.orderList.length == 0) {
            await Messages.warning(
                'Advertencia',
                'Este cliente no tiene facturas pendientes de pago.'
            );
            this.display = false;
        }
        this._createFormBuild();
        this.selectInvoice(this.orderList);
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
            this.renderer.selectRootElement('#sumApplied').focus();
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
                let newEntry = this.formSales.value as PaymentSaleModel;
                newEntry.docId = 0;
                newEntry.detail = this.detail;
                newEntry.docTotal = this.doctotal;
                newEntry.docDate = new Date(Date.now());
                newEntry.customerCode =
                    this.formSales.controls['customerCode'].value;
                newEntry.customerName =
                    this.formSales.controls['customerName'].value;
                newEntry.payConditionId =
                    this.formSales.controls['payConditionId'].value;
                newEntry.cashSum = Number(this.doctotal);
                newEntry.chekSum = this.payment.chekSum;
                newEntry.transferSum = this.payment.transferSum;
                newEntry.cardSum = this.payment.cardSum;
                this.detail = [];
                this.doctotal = 0;
                Messages.loading(
                    'Agregando',
                    'Agregando pago de factura de venta'
                );
                let payment = await this.paymentService.addPaymentSales(
                    newEntry
                );
                //this.printService.printInvoice(payment[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                //this.PaymentSalesModify.emit(payment);
                this.formSales.reset();
                this.formSales.controls['reference'].setValue('');
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }else{
            Messages.warning('Advertencia', 'Complete los datos antes de guardar.');
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

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent): void {
        if (event.key === 'F10') {
            event.preventDefault(); // Previene la acción predeterminada de abrir la ventana de configuración del navegador
            this.f10Pressed = true;
        }
        if (event.key === 'F7') {
            event.preventDefault(); // Previene la acción predeterminada de abrir la ventana de configuración del navegador
            this.f7Pressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent): void {
        if (event.key === 'F10' && this.f10Pressed) {
            this.add(); // Llama a tu función para guardar el documento
            this.f10Pressed = false;
        }
        if (event.key === 'F7' && this.f7Pressed) {
            this.router.navigate(['/listado-cobros-clientes'], {
                state: {},
            });
            this.f10Pressed = false;
        }
    }
}
