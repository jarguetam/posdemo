import { SalesService } from './../../services/sales.service';
import { DocumentSaleModel } from './../../models/document-model';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CopyOrderListComponent } from 'src/app/pages/purchase/invoice/copy-order-list/copy-order-list.component';
import { AuthService } from 'src/app/service/users/auth.service';
import { CopyOrderSaleListComponent } from '../copy-order-list/copy-order-list.component';
import { InvoiceSaleDialogComponent } from '../invoice-sale-dialog/invoice-sale-dialog.component';
import { PrintInvoiceSaleService } from '../../services/print-invoice-sale.service';
import { Router } from '@angular/router';
import { DbLocalService } from 'src/app/service/db-local.service';
import { User } from 'src/app/models/user';
import { PrintTicketService } from '../../services/print-ticket.service';
import { CompanyInfo } from 'src/app/models/company-info';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PrintEscPosService } from '../../services/print-esc-pos.service';

@Component({
    selector: 'app-invoice-sale-list',
    templateUrl: './invoice-sale-list.component.html',
    styleUrls: ['./invoice-sale-list.component.scss'],
})
export class InvoiceSaleListComponent implements OnInit {
    @ViewChild(InvoiceSaleDialogComponent)
    InvoiceSaleDialog: InvoiceSaleDialogComponent;
    @ViewChild(CopyOrderSaleListComponent)
    CopyOrderList: CopyOrderSaleListComponent;
    loading: boolean = false;
    title: string = 'Listado de facturas de venta';
    invoiceList: DocumentSaleModel[];
    formFilter: FormGroup;
    f10Pressed: boolean;
    isMobile: boolean;
    usuario: User;
    company: CompanyInfo;
    currentState!: ConnectionState;
    status: boolean;

    constructor(
        private invoiceService: SalesService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintInvoiceSaleService,
        private router: Router,
        private db: DbLocalService,
        private printTicketService: PrintTicketService,
        private printBluethootService: PrintEscPosService,
        private connectionService: ConnectionService
    ) {
        this.isMobile = this.detectMobile();
        this._createFormBuild();
        this.search();
        this.usuario = this.auth.UserValue;
        this.company = this.auth.CompanyValue;
    }

    ngOnInit() {
        this.invoiceService.isSync$.subscribe(async (isSync: boolean) => {
            this.loading = isSync;
            if(this.loading === false){
              await this.search();
            }
        });

        this._createFormBuild();
        this.connectionService
            .monitor()
            .pipe(
                tap(async (newState: ConnectionState) => {
                    this.currentState = newState;
                    if (this.currentState.hasNetworkConnection) {
                        this.status = true;
                       // await this.search();
                    } else {
                        this.status = false;
                    }
                })
            )
            .subscribe();
    }

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
        this.formFilter = this.formBuilder.group({
            from: [
                localDateString,
                Validators.required,
            ],
            to: [
                localDateString,
                Validators.required,
            ],
        });
    }


    async search() {
        try {
            this.loading = true;
            this.invoiceList = await this.invoiceService.getInvoiceByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            if (this.usuario.roleId != 1) {
                this.invoiceList = this.invoiceList.filter(
                    (x) => x.sellerId === this.usuario.sellerId
                );
            }
            this.loading =false;
            Messages.closeLoading();
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    invoiceModify(invoice: DocumentSaleModel[]) {
        // this.invoiceList = invoice;
        this.search();
    }

    async addInvoice() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        if (this.isMobile) {
            //this.InvoiceSaleDialog.showDialog(new DocumentSaleModel(), true);
            await this.router.navigate(['/listado-facturas-venta/factura-movil'], {
                state: {},
            });
        } else {
            await this.router.navigate(['/listado-facturas-venta/factura'], {
                state: {},
            });
        }
    }

    async editInvoice(invoice: DocumentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar pedidos, por favor solicite el acceso.'
            );
            return;
        }
       // this.InvoiceSaleDialog.showDialog(invoice, false);
       await this.router.navigate(['/listado-facturas-venta/factura-movil'], {
        state: {invoice},
    });
    }

    async viewInvoice(invoice: DocumentSaleModel) {
        if (!this.auth.hasPermission('btn_edit')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso.'
            );
            return;
        }
        await this.router.navigate(['/listado-facturas-venta/factura-movil'], {
            state: {invoice},
        });
    }

    async print(invoice: DocumentSaleModel) {
        if (this.isMobile) {
            await this.printBluethootService.printInvoice(invoice);
        } else if (this.company.printLetter === true) {
            await this.printService.printInvoice(invoice);
        } else {
            await this.printTicketService.printInvoice(invoice);
        }
    }

    showOrders() {
        this.CopyOrderList.showDialog();
    }

    orderSelected(order: DocumentSaleModel) {
        order.docReference = order.docId;
        this.InvoiceSaleDialog.showDialog(order, true);
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
            this.addInvoice(); // Llama a tu función para guardar el documento
            this.f10Pressed = false;
        }
    }

    async syncInvoice(invoice: DocumentSaleModel) {
        debugger
        try {
            //const MIN_DATE = new Date('0001-01-01T00:00:00Z'); // 01/01/0001
            //invoice.docDate = MIN_DATE;
            const currentDate = new Date();
            const localDateString = new Date(
                currentDate.getTime() -
                    currentDate.getTimezoneOffset() * 60000
            );
            invoice.docDate = localDateString;
            Messages.loading('Agregando', 'Agregando factura de venta');
            await this.invoiceService.addInvoice(invoice);

            await this.db.invoice.delete(invoice.id);
            await this.search();
            Messages.closeLoading();
        } catch (ex) {
            if(ex.error.message=="Error: Esta factura ya existe en la base de datos. UUID"){
                await this.db.invoice.delete(invoice.id);
                this.search();
            }
            Messages.closeLoading();
            Messages.warning('Advertencia', ex.error.message);
        }
    }
}
