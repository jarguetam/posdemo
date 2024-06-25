import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentModel } from '../../purchase/models/document';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { SalesInvoiceDialogComponent } from '../sales-invoice-dialog/sales-invoice-dialog.component';
import { SalesPaymentDialogComponent } from '../sales-payment-dialog/sales-payment-dialog.component';
import { PaymentSalesService } from '../service/payment-sales.service';
import { PrintPaymentSaleService } from '../service/print-payment-sale.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { PrintEscPaymentService } from '../service/print-esc-payment.service';
import { DbLocalService } from 'src/app/service/db-local.service';

@Component({
    selector: 'app-sales-payment-list',
    templateUrl: './sales-payment-list.component.html',
    styleUrls: ['./sales-payment-list.component.scss'],
})
export class SalesPaymentListComponent implements OnInit {
    @ViewChild(SalesPaymentDialogComponent)
    SalesPaymentDialog: SalesPaymentDialogComponent;
    @ViewChild(SalesInvoiceDialogComponent)
    SalesInvoiceDialog: SalesInvoiceDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de pagos de facturas de venta';
    paymentList: PaymentSaleModel[];
    formFilter: FormGroup;
    f10Pressed: boolean;
    isMobile: boolean;
    usuario: User;
    devices: any[] = [];
    selectedDevice: any;

    constructor(
        private paymentService: PaymentSalesService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintEscPaymentService,
        private router: Router,
        private db: DbLocalService,

    ) {
        this._createFormBuild();
        this.search();
        this.isMobile = this.detectMobile();
        this.usuario = this.auth.UserValue;
    }

    ngOnInit() {
        this._createFormBuild();
        this.search();
    }


       private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
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
            this.paymentList = await this.paymentService.getPaymentSalesByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            if (this.usuario.roleId != 1) {
                this.paymentList = this.paymentList.filter(
                    (x) => x.sellerId === this.usuario.sellerId
                );
            }
            if (this.isMobile) {
                this.paymentList = this.paymentList.filter(
                    (x) => x.payConditionId != 1
                );
            }
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    paymentModify(payment: PaymentSaleModel[]) {
        this.paymentList = payment;
        this.search();
    }

    async addPayment() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        if (this.isMobile) {
            this.SalesPaymentDialog.showDialog(new PaymentSaleModel(), true);
        } else {
            await this.router.navigate(['/listado-cobros-clientes/pagos'], {
                state: {},
            });
        }
    }

    editPayment(payment: PaymentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
        this.SalesPaymentDialog.showDialog(payment, false);
    }

    viewPayment(payment: PaymentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
        this.SalesPaymentDialog.showDialog(payment, false);
    }

    async print(payment: PaymentSaleModel) {
        await this.printService.printInvoice(payment);
    }

    showInvoiceSales() {
        //  this.SalesPaymentDialog.showDialog();
    }

    invoiceSelected(order: DocumentModel[]) {
        //  order.docReference = order.docId;
        //  this.SalesPaymentDialog.showDialog(order, true);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent): void {
        if (event.key === 'F10') {
            event.preventDefault(); // Previene la acción predeterminada de abrir la ventana de configuración del navegador
            this.f10Pressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent): void {
        if (event.key === 'F10' && this.f10Pressed) {
            this.addPayment(); // Llama a tu función para guardar el documento
            this.f10Pressed = false;
        }
    }

    async syncPayment(payment: PaymentSaleModel) {
        try {
            Messages.loading('Agregando', 'Agregando pago de venta');
            const currentDate = new Date();
            const localDateString = new Date(
                currentDate.getTime() -
                    currentDate.getTimezoneOffset() * 60000
            );
            payment.docDate = localDateString;
            await this.paymentService.addPaymentSales(payment);
            await this.db.payment.delete(payment.id);
            await this.search();
            Messages.closeLoading();
        } catch (ex) {
            if (
                ex.error.message ==
                'Error: Este pago ya existe en la base de datos. UUID'
            ) {
                await this.db.payment.delete(payment.id);
                this.search();
            }
            Messages.closeLoading();
            Messages.warning('Advertencia', ex.error.message);
        }
    }
}
