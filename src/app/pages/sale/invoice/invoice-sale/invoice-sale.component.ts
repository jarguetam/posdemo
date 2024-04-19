import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyInfo } from 'src/app/models/company-info';
import { Correlative } from 'src/app/models/correlative-sar';
import { PayCondition } from 'src/app/models/paycondition';
import { User } from 'src/app/models/user';
import { CustomerBrowserComponent } from 'src/app/pages/browser/customer/customer-browser/customer-browser.component';
import { ItemsBrowserPriceSalesComponent } from 'src/app/pages/browser/items/items-browser-price-sales/items-browser-price-sales.component';
import { PaymentMetodDialogComponent } from 'src/app/pages/common/payment-metod-dialog/payment-metod-dialog.component';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { PaymentSaleModel } from 'src/app/pages/sales-payment/models/payment-sale-model';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { DocumentSaleDetailModel } from '../../models/document-detail-model';
import { DocumentSaleModel } from '../../models/document-model';
import { InvoiceSaleDialogComponent } from '../invoice-sale-dialog/invoice-sale-dialog.component';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { PrintInvoiceSaleService } from '../../services/print-invoice-sale.service';
import { SalesService } from '../../services/sales.service';
import { PaymentMetodModel } from 'src/app/pages/common/models/payment-metod-model';
import { CustomerModel } from 'src/app/pages/customers/models/customer';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { Messages } from 'src/app/helpers/messages';
import { Route, Router } from '@angular/router';
import { PrintTicketService } from '../../services/print-ticket.service';

@Component({
    selector: 'app-invoice-sale',
    templateUrl: './invoice-sale.component.html',
    styleUrls: ['./invoice-sale.component.scss'],
})
export class InvoiceSaleComponent implements OnInit {
    private f10Pressed = false;
    private f7Pressed = false;
    title: string = 'Factura de venta';
    @ViewChild(ItemsBrowserPriceSalesComponent)
    ItemsBrowser: ItemsBrowserPriceSalesComponent;
    @ViewChild(CustomerBrowserComponent)
    CustomerBrowser: CustomerBrowserComponent;
    @ViewChild(InvoiceSaleDialogComponent)
    InvoiceSaleDialog: InvoiceSaleDialogComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    @ViewChild('quantityInput') quantityInput: ElementRef;
    @ViewChild('barcodeInput') barcodeInput: ElementRef;
    @ViewChild('docDate') docDate: ElementRef;
    invoice: DocumentSaleModel = new DocumentSaleModel();
    isAdd: boolean = true;
    isTax: boolean = false;
    disabled: boolean = false;
    formInvoice: FormGroup;
    formSearchItem: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    subdoctotal: number = 0;
    descuentoTotal: number = 0;
    tax: number = 0;
    docQuantity: number = 0;
    descuento: number = 0;
    wareHouseList: WareHouseModel[];
    detail: DocumentSaleDetailModel[] = [];
    sellerList: SellerModel[];
    sarList: Correlative[] = [];
    index = 0;
    barcodeValue: string = '';
    company: CompanyInfo;
    payment: PaymentSaleModel = new PaymentSaleModel();
    payConditionList: PayCondition[];
    description: string = '';
    itemSelect: ItemWareHouse;

    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: SalesService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintInvoiceSaleService,
        private auth: AuthService,
        private sellerService: SellerService,
        private commonService: CommonService,
        private renderer: Renderer2,
        private router: Router,
        private printTicketService: PrintTicketService
    ) {
        this.usuario = this.auth.UserValue;
        this.company = this.auth.CompanyValue;
        this.formSearchItem = this.formBuilder.group({
            barcode: ['', Validators.required],
            description: ['', Validators.required],
            quantity: [0, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit(): void {
        this._createFormBuild();
        this._getWareHouse();
        this._getSellers();
        this._getNumeration();
        this.isAdd = true;
        this.loading = false;
    }
    ngAfterViewInit(): void {
        this.docDate.nativeElement.focus();
    }

    async _getWareHouse() {
        try {
            this.loading = true;
            this.wareHouseList =
                await this.wareHouseService.getWarehouseActive();
            this.wareHouseList.unshift({
                whsCode: 0,
                whsName: 'Seleccione un almacen',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async _getSellers() {
        try {
            this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            this.sellerList = await this.sellerService.getSeller();
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione el vendedor',
                whsCode: 0,
                whsName: '',
                regionId: 0,
                regionName: '',
                createByName: '',
                createBy: 0,
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async _getNumeration() {
        try {
            this.loading = true;
            this.sarList = await this.commonService.getCorrelativeInvoice();
            this.sarList.unshift({
                userName: '',
                pointSale: '',
                branch: '',
                correlativeId: 0,
                authorizeRangeFrom: 0,
                authorizeRangeTo: 0,
                currentCorrelative: 0,
                cai: 'Seleccione numeracion',
                branchId: '',
                pointSaleId: '',
                typeDocument: '',
                typeDocumentName: '',
                dateLimit: undefined,
                userId: 0,
                createDate: undefined,
                description: 'Selecciones la numeracion',
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async showDialog(invoiceNew: DocumentSaleModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = isAdd ? false : true;
        this.invoice = invoiceNew;
        if (isAdd) {
            this.detail = invoiceNew.detail;
        } else {
            this.invoice.detail = invoiceNew.detailDto;
            this.detail = invoiceNew.detailDto;
        }
        this.docQuantity = invoiceNew.docQty;
        this.doctotal = invoiceNew.docTotal;
        this.doctotal = invoiceNew.docTotal;
        this.subdoctotal = invoiceNew.subTotal;
        this.descuento = invoiceNew.disccounts;
        this.descuentoTotal = invoiceNew.discountsTotal;
        this.docQuantity = invoiceNew.docQty;
        this.tax = invoiceNew.tax;
        this.isTax = invoiceNew.taxSupplier;
        if (!isAdd) {
            this.index = invoiceNew.detail.length;
        }
        this._getWareHouse();
        this._getSellers();
        this._getNumeration();
        this._createFormBuild();

        this.payConditionList = this.payConditionList
            .filter(
                (x) =>
                    x.payConditionId === 1 ||
                    x.payConditionId === invoiceNew.payConditionId
            )
            .sort((a, b) => b.payConditionId - a.payConditionId);
        // this.valueChangePayCondition();
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formInvoice = this.formBuilder.group({
            docId: [this.invoice.docId ?? 0],
            docReference: [this.invoice.docReference ?? 0],
            docDate: [
                this.invoice.docDate ??
                    new Date().toISOString().substring(0, 10),
            ],
            customerId: [this.invoice.customerId ?? 0, Validators.required],
            customerCode: [
                this.invoice.customerCode ?? '',
                Validators.required,
            ],
            customerName: [
                this.invoice.customerName ?? '',
                Validators.required,
            ],
            customerRTN: [this.invoice.customerRTN ?? ''],
            customerAddress: [this.invoice.customerAddress ?? ''],
            sellerId: [
                this.invoice.sellerId ?? this.usuario.sellerId,
                Validators.required,
            ],
            correlativeId: [
                this.invoice.correlativeId ?? this.usuario.sarCorrelativeId,
                Validators.required,
            ],
            payConditionId: [
                this.invoice.payConditionId ?? 0,
                Validators.required,
            ],
            payConditionName: [this.invoice.payConditionName ?? 0],
            comment: [this.invoice.comment ?? 'Factura de venta'],
            reference: [this.invoice.reference ?? '-'],
            subTotal: [this.invoice.subTotal ?? 0],
            tax: [this.invoice.tax ?? 0],
            disccounts: [this.invoice.disccounts ?? 0],
            discountsTotal: [this.invoice.discountsTotal ?? 0],
            docTotal: [this.invoice.docTotal ?? 0],
            docQty: [this.invoice.docQty ?? 0],
            whsCode: [
                this.invoice.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            createBy: [this.invoice.createBy ?? this.usuario.userId],
            priceListId: [this.invoice.priceListId ?? 0],
            detail: [[]],
        });
    }

    new() {
        this.invoice = undefined;
        this.formInvoice = undefined;
    }

    addLine(detail: DocumentSaleDetailModel[]) {
        detail.push(
            new DocumentSaleDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                price: 0,
                stock: 0,
                cost: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                isDelete: false,
                isTax: false,
                taxValue: 0,
            })
        );
        this.showDialogItem(this.invoice.detail.length - 1);
        this.index++;
    }

    deleteLine(itemId) {
        if (!this.isAdd) {
            this.detail.find((x) => x.itemCode === itemId).isDelete = true;
            this.invoice.detail.find((x) => x.itemCode === itemId).isDelete =
                true;
            this.invoice.detail = this.invoice.detail.filter(
                (x) => x.isDelete == false
            );
            this.calculate();
            this.index--;
        } else {
            this.invoice.detail = this.invoice.detail.filter(
                (x) => x.itemCode != itemId
            );
            this.calculate();
            this.index--;
        }
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog(
            this.formInvoice.get('whsCode').value,
            this.formInvoice.get('customerId').value,
            this.invoice.priceListId
        );
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
        if (barcode.length > 0) {
            if (this.formInvoice.get('whsCode').value === 0) {
                setTimeout(() => {
                    Messages.warning(
                        'Advertencia',
                        'Debe seleccionar el almacén primero.'
                    );
                }, 100); // Espera 100 milisegundos antes de mostrar el mensaje
                return;
            }
            if (this.formInvoice.get('customerId').value === undefined) {
                setTimeout(() => {
                    Messages.warning(
                        'Advertencia',
                        'Debe seleccionar el cliente primero.'
                    );
                }, 100);
                return;
            }
            if (this.invoice.priceListId === undefined) {
                setTimeout(() => {
                    Messages.warning(
                        'Advertencia',
                        'Debe seleccionar el cliente primero.'
                    );
                }, 100);
                return;
            }

            this.ItemsBrowser.findByBardCode(
                this.formInvoice.get('whsCode').value,
                this.formInvoice.get('customerId').value,
                this.invoice.priceListId,
                barcode
            );
            //
        }
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.invoice.detail.push(
            new DocumentSaleDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                price: 0,
                stock: 0,
                cost: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                isDelete: false,
                isTax: false,
                taxValue: 0,
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
        this.showDialogItem(this.invoice.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        this.invoice.detail.push(
            new DocumentSaleDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                price: 0,
                stock: 0,
                cost: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                isDelete: false,
                isTax: false,
                taxValue: 0,
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
        if (this.ItemsBrowser.index != -1) {
            let itemFind = this.invoice.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind != undefined) {
                this.invoice.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                let deleteIndex = this.invoice.detail.filter(
                    (x) => x.itemId == 0
                );
                this.index = this.index - deleteIndex.length;
                this.invoice.detail = this.invoice.detail.filter(
                    (x) => x.itemId != 0
                );
                this.calculate();
            } else {
                this.itemSelect = item;
                this.formSearchItem.patchValue({ description: item.itemName });
                this.formSearchItem.patchValue({ barcode: item.itemCode });
                this.quantityInput.nativeElement.focus();
            }
        }
    }

    addLineProduct() {
        let currentIndex = this.ItemsBrowser.index;
        // if (this.itemSelect.stock <= 0)
        //     Messages.warning('Advertencia', 'Este articulo no tiene Stock');
        this.invoice.detail[currentIndex].itemId = this.itemSelect.itemId;
        this.invoice.detail[currentIndex].itemCode = this.itemSelect.itemCode;
        this.invoice.detail[currentIndex].itemName = this.itemSelect.itemName;
        this.invoice.detail[currentIndex].unitOfMeasureId =
            this.itemSelect.unitOfMeasureId;
        this.invoice.detail[currentIndex].unitOfMeasureName =
            this.itemSelect.unitOfMeasureName;
        this.invoice.detail[currentIndex].quantity =
            this.formSearchItem.get('quantity').value;
        this.invoice.detail[currentIndex].price = this.itemSelect.priceSales;
        this.invoice.detail[currentIndex].cost = this.itemSelect.avgPrice;
        this.invoice.detail[currentIndex].dueDate = this.itemSelect.dueDate;
        this.invoice.detail[currentIndex].stock = this.itemSelect.stock;
        this.invoice.detail[currentIndex].isTax = this.itemSelect.tax;
        this.isTax = this.itemSelect.tax;
        this.formSearchItem.reset();
        this.barcodeInput.nativeElement.focus();
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.invoice.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.invoice.detail = this.invoice.detail.filter((x) => x.itemId != 0);
        this.calculate();
    }

    showDialogCustomer() {
        this.CustomerBrowser.showDialog(this.usuario.sellerId);
    }

    @HostListener('document:keydown.F8', ['$event']) onF8Keydown(
        event: KeyboardEvent
    ) {
        this.showDialogCustomer();
    }

    async browserCustomer(customer: CustomerModel) {
        this.invoice.customerId = customer.customerId;
        this.invoice.customerCode = customer.customerCode;
        this.invoice.customerName = customer.customerName;
        this.invoice.customerAddress = customer.address;
        this.invoice.customerRTN = customer.rtn;
        this.invoice.payConditionId = customer.payConditionId;
        this.invoice.payConditionName = customer.payConditionName;
        this.invoice.payConditionDays = customer.payConditionDays;
        this.invoice.priceListId = customer.listPriceId;
        let date = new Date(); // fecha actual
        date.setDate(date.getDate() + customer.payConditionDays);
        this.invoice.dueDate = date;
        this.isTax = customer.tax;
        this.payConditionList = this.payConditionList
            .filter(
                (x) =>
                    x.payConditionId === 1 ||
                    x.payConditionId === customer.payConditionId
            )
            .sort((a, b) => b.payConditionId - a.payConditionId);
        let docDate = this.formInvoice.get('docDate').value;
        this.invoice.docDate = docDate;
        this._createFormBuild();
        this.calculate();
        this.barcodeInput.nativeElement.focus();
    }

    calculate() {
        setTimeout(() => {
            this.invoice.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            this.invoice.detail.forEach(
                (x) =>
                    (x.taxValue = x.isTax
                        ? x.lineTotal * this.company.taxValue
                        : 0)
            );
            const total = this.invoice.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.invoice.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.subdoctotal = total;
            this.descuentoTotal = (this.subdoctotal * this.descuento) / 100;
            this.tax = this.invoice.detail.reduce(
                (acumulador, producto) => acumulador + producto.taxValue,
                0
            );
            this.doctotal = this.subdoctotal - this.descuentoTotal + this.tax;
            this.docQuantity = totalQty;
        }, 500);
    }

    async add(newEntry: DocumentSaleModel) {
        if (this.formInvoice.valid) {
            try {
                Messages.loading('Agregando', 'Agregando factura de venta');
                newEntry.docId = 0;
                newEntry.detail = this.invoice.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.disccounts = this.descuento;
                newEntry.discountsTotal = this.descuentoTotal;
                newEntry.subTotal = this.subdoctotal;
                newEntry.tax = this.tax;
                newEntry.docTotal = this.doctotal;
                newEntry.dueDate = this.invoice.dueDate;
                newEntry.createBy = this.usuario.userId;
                let invoice = await this.invoiceService.addInvoice(newEntry);
                let docDate = this.formInvoice.get('docDate').value;
                this.invoice.docDate = docDate;
                this.formInvoice.reset();
                this.invoice.detail = [];
                this.formInvoice.patchValue({ docDate: this.invoice.docDate });
                this.formInvoice.patchValue({ sellerId: this.usuario.sellerId });
                this.formInvoice.patchValue({ correlativeId:  this.usuario.sarCorrelativeId });
                this.formInvoice.patchValue({ whsCode:  this.usuario.whsCode });
                this.calculate();
                this._getSellers();
                //this.InvoiceSaleModify.emit(invoice);
                this.display = false;
                this.index = 0;
                this.docDate.nativeElement.focus();
                if(!this.company.printLetter){
                    this.print(invoice[0]);
                }
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formInvoice.valid) {
            try {
                Messages.loading('Agregando', 'Editando factura de venta');

                let newEntry = this.formInvoice.value as DocumentSaleModel;
                let newLine = this.invoice.detail.filter(
                    (x) => x.docDetailId == 0
                );
                newLine.forEach((x) => (x.docId = newEntry.docId));
                this.detail = this.detail.filter((x) => x.docDetailId != 0);
                this.detail.push(...newLine);
                newEntry.detail = this.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.disccounts = this.descuento;
                newEntry.discountsTotal = this.descuentoTotal;
                newEntry.subTotal = this.subdoctotal;
                newEntry.tax = this.tax;
                newEntry.docTotal = this.doctotal;
                newEntry.createBy = this.usuario.userId;
                let invoice = await this.invoiceService.updateInvoice(newEntry);
                this.printService.printInvoice(invoice[0]);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                //this.InvoiceSaleModify.emit(invoice);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async cancelInvoice() {
        let cancel = await Messages.question(
            'Cancelacion',
            'Cancelar esta factura es irreversible. ¿Seguro desea continuar?'
        );
        if (cancel) {
            try {
                let newEntry = this.formInvoice.value as DocumentSaleModel;
                let invoice = await this.invoiceService.cancelInvoice(
                    newEntry.docId
                );
                // this.InvoiceSaleModify.emit(invoice);
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

    print(invoice: DocumentSaleModel) {
        if (this.company.printLetter) {
            this.printService.printInvoice(invoice);
        } else {
            this.printTicketService.printInvoice(invoice);
        }
    }

    invoiceModify(invoice: DocumentSaleModel[]) {
        // this.invoiceList = invoice;
        invoice[0].complete = true;
        // this.InvoiceSaleModify.emit(invoice);
        this.display = false;
    }

    addInvoice() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        this.invoice.docReference = this.invoice.docId;
        this.invoice.detail.forEach((doc) => (doc.docDetailId = 0));
        // this.InvoiceSaleDialog.showDialog(this.invoice, true);
    }

    addTypeInvoice() {
        let newEntry = this.formInvoice.value as DocumentSaleModel;
        if (newEntry.payConditionId === 1) {
            let newEntryPayment = this.formInvoice.value as DocumentSaleModel;
            newEntryPayment.payment = this.payment;
            this.payment.cashSum = this.doctotal;
            this.payment.chekSum = 0;
            this.payment.transferSum = 0;
            this.payment.cardSum = 0;
            this.payment.sellerId = newEntry.sellerId;
            this.add(newEntryPayment);
            //this.addMetod();
        } else {
            this.add(newEntry);
        }
    }

    async addMetod() {
        await this.PaymentMetodDialog.showDialog(this.doctotal);
    }

    async selectPaymentMetod(metods: PaymentMetodModel) {
        this.payment.cashSum = metods.cashSum;
        this.payment.chekSum = metods.chekSum;
        this.payment.transferSum = metods.transferSum;
        this.payment.cardSum = metods.cardSum;
        let newEntry = this.formInvoice.value as DocumentSaleModel;
        newEntry.payment = this.payment;
        this.add(newEntry);
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
            this.addTypeInvoice(); // Llama a tu función para guardar el documento
            this.f10Pressed = false;
        }
        if (event.key === 'F7' && this.f7Pressed) {
            this.goBack();
            this.f10Pressed = false;
        }
    }

    private goBack() {
        this.router.navigate(['/listado-facturas-venta'], {
            state: {},
        });
    }
}
