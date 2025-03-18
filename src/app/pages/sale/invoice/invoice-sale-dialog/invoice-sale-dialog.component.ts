import { AuthService } from 'src/app/service/users/auth.service';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { CustomerBrowserComponent } from 'src/app/pages/browser/customer/customer-browser/customer-browser.component';
import { CustomerModel } from 'src/app/pages/customers/models/customer';
import { DocumentSaleDetailModel } from '../../models/document-detail-model';
import { DocumentSaleModel } from '../../models/document-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsBrowserPriceSalesComponent } from 'src/app/pages/browser/items/items-browser-price-sales/items-browser-price-sales.component';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { Messages } from 'src/app/helpers/messages';
import { SalesService } from '../../services/sales.service';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { CommonService } from 'src/app/service/common.service';
import { Correlative } from 'src/app/models/correlative-sar';
import { CompanyInfo } from 'src/app/models/company-info';
import { PaymentMetodModel } from 'src/app/pages/common/models/payment-metod-model';
import { PaymentSaleModel } from 'src/app/pages/sales-payment/models/payment-sale-model';
import { PaymentMetodDialogComponent } from 'src/app/pages/common/payment-metod-dialog/payment-metod-dialog.component';
import { PayCondition } from 'src/app/models/paycondition';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { combineLatest, tap } from 'rxjs';
import { Table } from 'primeng/table';
import { PrintEscPosService } from '../../services/print-esc-pos.service';
import { ListModel } from '../../models/list-model';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ItemService } from 'src/app/pages/items/service/items.service';
import { ConfirmationService } from 'primeng/api';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Component({
    selector: 'app-invoice-sale-dialog',
    templateUrl: './invoice-sale-dialog.component.html',
    styleUrls: ['./invoice-sale-dialog.component.scss'],
})
export class InvoiceSaleDialogComponent implements OnInit {
    @Output() InvoiceSaleModify = new EventEmitter<DocumentSaleModel[]>();
    @ViewChild(ItemsBrowserPriceSalesComponent)
    ItemsBrowser: ItemsBrowserPriceSalesComponent;
    @ViewChild(CustomerBrowserComponent)
    CustomerBrowser: CustomerBrowserComponent;
    @ViewChild(InvoiceSaleDialogComponent)
    InvoiceSaleDialog: InvoiceSaleDialogComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    @ViewChild('dt') vsTable: Table;
    @ViewChildren('quantity') quantityInputs: QueryList<any>;
    @ViewChild('swiperRow') swiperRow: ElementRef;
    invoice: DocumentSaleModel = new DocumentSaleModel();
    isAdd: boolean;
    isTax: boolean = false;
    disabled: boolean = false;
    formInvoice: FormGroup;
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
    list: ListModel[] = [];
    sellerList: SellerModel[];
    sarList: Correlative[] = [];
    index = 0;
    barcodeValue: string = '';
    company: CompanyInfo;
    payment: PaymentSaleModel = new PaymentSaleModel();
    payConditionList: PayCondition[];
    payConditionListFilter: PayCondition[];
    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;
    status: boolean;
    currentState!: ConnectionState;
    disabledwsh: boolean = false;
    isOffline: boolean = false;
    offlineId: number = 0;
    title: string = 'Agregar factura';
    limitInvoiceCredit: number = 0;
    balance: number = 0;
    creditLine: number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: SalesService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintEscPosService,
        private auth: AuthService,
        private sellerService: SellerService,
        private commonService: CommonService,
        private db_local: DbLocalService,
        private connectionService: ConnectionService,
        private router: Router,
        private itemService: ItemService,
        private confirmationService: ConfirmationService,
        private connectionStateService: ConnectionStateService
    ) {
        this.usuario = this.auth.UserValue;
        this.company = this.auth.CompanyValue;
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

    get chipStyle() {
        const baseColor = this.status ? '#00b300' : '#ff0000';
        return {
            'background-color': baseColor,
            color: 'white',
            'border-radius': '20px',
            padding: '8px',
            display: 'flex',
            'align-items': 'center',
            'font-weight': 'bold',
            'box-shadow': `0 0 10px ${baseColor}`,
        };
    }

    ngOnInit(): void {
        if (history.state.invoice) {
            this.isAdd = false;
            this.title = 'Editar factura';
            if (
                history.state.invoice.docReference != undefined &&
                history.state.invoice.docReference != 0
            ) {
                this.isAdd = true;
                this.title = 'Agregar factura';
            }
            this.showDialog(history.state.invoice, this.isAdd);
        } else {
            this.showDialog(new DocumentSaleModel(), true);
        }
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
            this.payConditionListFilter =
                await this.commonService.getPayConditionActive();
            this.payConditionList = this.payConditionListFilter;
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
            this.sarList = await this.commonService.getCorrelativeInvoiceById(
                this.usuario.sarCorrelativeId
            );
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
        if (invoiceNew.id != null && invoiceNew.id !== 0) {
            this.isOffline = true;
            this.offlineId = invoiceNew.id;
        }
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        if (!this.isAdd) {
            this.title = 'Factura de venta';
        }
        this.disabled = isAdd ? false : true;
        this.invoice = invoiceNew;
        if (isAdd || this.isOffline) {
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
        await this._getWareHouse();
        await this._getSellers();
        await this._getNumeration();
        this.disabledwsh = this.usuario.role == 'Vendedor' ? true : false;
        this._createFormBuild();
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formInvoice = this.formBuilder.group({
            docId: [this.invoice.docId ?? 0],
            docReference: [this.invoice.docReference ?? 0],
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

        if (this.disabledwsh) this.formInvoice.get('whsCode').disable();
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
                weight: 0,
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
            this.invoice.priceListId,
            this.invoice.detail
        );
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.findByBardCode(
            this.formInvoice.get('whsCode').value,
            this.formInvoice.get('customerId').value,
            this.invoice.priceListId,
            barcode
        );
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
                weight: 0,
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
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
                weight: 0,
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
        this.showDialogItem(this.invoice.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        this.invoice.detail = this.itemService.itemsListService.map((item) => {
            const detail = new DocumentSaleDetailModel();
            detail.itemCode = item.itemCode;
            detail.itemName = item.itemName;
            detail.itemId = item.itemId;
            detail.quantity = item.quantity;
            detail.price = item.priceSales;
            detail.cost = item.avgPrice;
            detail.dueDate = item.dueDate;
            detail.stock = item.stock;
            detail.isTax = item.tax;
            detail.lineTotal = item.quantity * item.priceSales;
            detail.unitOfMeasureId = item.unitOfMeasureId;
            detail.unitOfMeasureName = item.unitOfMeasureName;
            return detail;
        });
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.invoice.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.invoice.detail = this.invoice.detail.filter((x) => x.itemId != 0);
        setTimeout(() => {
            this.calculate();
            this.vsTable.scrollTo({ bottom: 0, behavior: 'smooth' });
            // this.renderer.selectRootElement('#quantity').focus();
            const lastQuantityInput = this.quantityInputs.last;
            if (lastQuantityInput) {
                lastQuantityInput.nativeElement.focus();
            }
        }, 500);
    }

    showDialogCustomer() {
        this.CustomerBrowser.showDialog(this.usuario.sellerId);
    }

    async browserCustomer(customer: CustomerModel) {
        this.payConditionListFilter = await this.payConditionList
            .filter(
                (x) =>
                    x.payConditionId === 1 ||
                    x.payConditionId === customer.payConditionId
            )
            .sort((a, b) => b.payConditionId - a.payConditionId);
        this.invoice.customerId = customer.customerId;
        this.invoice.customerCode = customer.customerCode;
        this.invoice.customerName = customer.customerName;
        this.invoice.customerAddress = customer.address;
        this.invoice.customerRTN = customer.rtn;
        this.invoice.payConditionId = customer.payConditionId;
        this.invoice.payConditionName = customer.payConditionName;
        this.invoice.payConditionDays = customer.payConditionDays;
        this.invoice.priceListId = customer.listPriceId;
        this.limitInvoiceCredit = customer.limitInvoiceCredit;
        this.balance = customer.balance;
        this.creditLine = customer.creditLine;
        const currentDate = new Date();

        let date = new Date(); // fecha actual
        date = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        );
        date.setDate(date.getDate() + customer.payConditionDays);

        this.invoice.dueDate = date;
        this.isTax = customer.tax;
        this._createFormBuild();
        this.calculate();
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

    @HostListener('document:keydown.F4', ['$event']) onF4Keydown(
        event: KeyboardEvent
    ) {
        this.addTypeInvoice();
    }

    // Método para confirmar el tipo de pago
    async confirmPaymentType(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.confirmationService.confirm({
                message: '¿Es esta una factura al crédito o al contado?',
                header: 'Confirmación de tipo de pago',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // El usuario confirmó que es al contado
                    this.formInvoice.patchValue({
                        payConditionId: 1,
                    });
                    resolve(true);
                },
                reject: () => {
                    // El usuario confirmó que es al credito
                    this.formInvoice.patchValue({
                        payConditionId: this.invoice.payConditionId,
                    });
                    resolve(true);
                },
            });
        });
    }

    hasNullQuantities(details: any[]): boolean {
        return details.some((item) => item.quantity == null);
    }

    async add(newEntry: DocumentSaleModel) {
        if (!this.formInvoice.valid) return;
        try {
            if (this.disabledwsh) {
                newEntry.whsCode = this.usuario.whsCode;
                newEntry.docId = 0;
            }
            newEntry.detail = this.invoice.detail;
            newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
            if (this.hasNullQuantities(newEntry.detail)) {
                Messages.closeLoading();
                Messages.warning('Advertencia', 'Ingrese la cantidad');
                return;
            }
            Messages.loading('Agregando', 'Agregando factura de venta');
            newEntry.disccounts = this.descuento;
            newEntry.discountsTotal = this.descuentoTotal;
            newEntry.subTotal = this.subdoctotal;
            newEntry.payConditionName = this.payConditionList.find(
                (x) => x.payConditionId == newEntry.payConditionId
            ).payConditionName;
            newEntry.tax = this.tax;
            newEntry.docTotal = this.doctotal;
            newEntry.dueDate = this.invoice.dueDate;
            newEntry.createBy = this.usuario.userId;
            newEntry.sellerName = this.sellerList.find(
                (x) => x.sellerId === newEntry.sellerId
            ).sellerName;
            newEntry.createByName = this.usuario.name;
            const MIN_DATE = new Date('0001-01-01T00:00:00Z'); // 01/01/0001
            newEntry.docDate = MIN_DATE;
            newEntry.uuid = uuidv4();
            if (this.status) {
                newEntry.offline = true;
                let invoice = await this.invoiceService.addInvoice(newEntry);
                await this.printService.printInvoice(invoice[0], 'Factura');
                let correlative = await this.db_local.correlative.toArray();
                this.updateCorrelative(correlative[0].correlativeId);
                this.itemService.itemsListService = [];
                await this.db_local.customers
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .modify((x) => {
                        x.balance = x.balance + newEntry.docTotal;
                    });
                await this.router.navigate(['/listado-facturas-venta'], {
                    state: {},
                });
                await this.router.navigate(['/listado-facturas-venta'], {
                    state: {},
                });
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.display = false;
                this.index = 0;
            } else {
                await this.addOffline(newEntry);
            }
        } catch (ex) {
            Messages.closeLoading();

            let message: string = '';
            if (ex.error && ex.error.message) {
                message = ex.error.message.toString();
            } else if (ex.message == 'Error: Printer not connected') {
                message = ex.error.message.toString();
            } else if (ex.message) {
                message =
                    'La solicitud tardó demasiado en enviarse y se guardará localmente para su procesamiento posterior.';
            } else {
                message = 'Error desconocido';
            }
            await Messages.warning('Advertencia', message);
            if (!message.includes('Error')) {
                await this.addOffline(newEntry);
            }

            const savedAsOrder = await this.handleSaveAsOrder(newEntry, message);
        }
    }

    private async handleSaveAsOrder(newEntry: DocumentSaleModel, errorMessage: string): Promise<boolean> {
        try {
            // Preguntar al usuario si desea guardar como pedido
            const result = await Messages.question(
                'Error al crear factura',
                `${errorMessage} ¿Desea guardar como pedido?`,
                'Sí, guardar como pedido',
                'No, cancelar'
            );

            if (result) {
                if (this.status) {
                    // Si hay conexión, guardar en el servidor
                    newEntry.docId = 0;
                    await this.invoiceService.addOrder(newEntry);
                } else {
                    // Si no hay conexión, guardar localmente
                    await this.db_local
                        .table('orderSales')
                        .add(newEntry)
                        .then(async (data) => {
                            newEntry.detail.map(
                                async (x) =>
                                    await this.loadInventoryOffline(
                                        x.itemId,
                                        x.quantity
                                    )
                            );
                        })
                        .catch((err) =>
                            console.error(
                                'Error storing data locally:',
                                err.message
                            )
                        );
                }

                Messages.Toas('Pedido guardado correctamente');
                this.display = false;
                this.index = 0;
                await this.router.navigate(['/listado-pedidos'], {
                    state: {},
                });
                return true;
            }
            return false;
        } catch (orderError) {
            Messages.warning(
                'Error',
                'No se pudo guardar el pedido: ' + orderError.message
            );
            return false;
        }
    }

    async addOffline(newEntry: DocumentSaleModel) {
        try {
            const hasPriceZero = newEntry.detail.some(
                (item) => item.price === 0
            );
            if (hasPriceZero) {
                Messages.Toas(
                    'Advertencia',
                    'No puede agregar un articulo con precio 0'
                );
                return;
            }
            let correlative = await this.db_local.correlative.toArray();
            newEntry.authorizedRangeFrom = this.formatNumberTo8Digits(
                correlative[0].authorizeRangeFrom
            );
            newEntry.authorizedRangeTo = this.formatNumberTo8Digits(
                correlative[0].authorizeRangeTo
            );
            newEntry.cai = correlative[0].cai;
            newEntry.limitIssue = correlative[0].dateLimit;
            newEntry.point = correlative[0].pointSale;
            newEntry.establishment = correlative[0].branch;
            let number = correlative[0].currentCorrelative + 1;
            newEntry.invoiceFiscalNo = this.formatNumberTo8Digits(number);
            newEntry.deiNumber = this.formatNumberTo8Digits(number);
            const currentDate = new Date();
            const hondurasOffset = -6 * 60; // Honduras tiene una diferencia horaria de -6 horas respecto a UTC
            const localDate = new Date(
                currentDate.getTime() +
                    (currentDate.getTimezoneOffset() + hondurasOffset) * 60000
            );
            newEntry.docDate = localDate;

            if (newEntry.payConditionId != 1) {
                //Validaciones de credito Offline
                const data = await this.db_local.customers
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .toArray();
                const facturasOffline = await this.db_local.invoice
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .toArray();
                let disponible = data[0].creditLine - data[0].balance;
                let limiteFacturas = data[0].limitInvoiceCredit;
                let facturasCliente = await this.db_local.invoiceSeller
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .toArray();
                let facturasCreditoOffline = facturasOffline.filter(
                    (x) => x.payConditionId != 1
                ).length;
                let faturasDisponibles =
                    limiteFacturas -
                    (facturasCliente.length + facturasCreditoOffline);
                if (newEntry.docTotal > disponible) {
                    await Messages.warning(
                        'Advertencia',
                        'No puede agregar esta factura, se supera el limite disponible de: L.' +
                            disponible
                    );
                    await this.handleSaveAsOrder(newEntry, 'No se puede agregar artículos con precio 0');
                    return;
                } else if (faturasDisponibles <= 0) {
                    await Messages.warning(
                        'Advertencia',
                        'No puede agregar esta factura, no tiene facturas de credito disponibles: ' +
                            faturasDisponibles
                    );
                    await this.handleSaveAsOrder(newEntry, 'No puede agregar esta factura, no tiene facturas de credito disponibles: ' +
                            faturasDisponibles);
                } else {
                    await this.addInvoiceToLocal(correlative, newEntry);
                    newEntry.paidToDate = newEntry.docTotal;
                    newEntry.balance = newEntry.docTotal;
                    newEntry.docId = number;
                    await this.db_local.table('invoiceSeller').add(newEntry);
                }
            } else {
                await this.addInvoiceToLocal(correlative, newEntry);
            }
        } catch (error) {
            Messages.warning(error);
            Messages.closeLoading();
        }
    }

    async addInvoiceToLocal(
        correlative: Correlative[],
        newEntry: DocumentSaleModel
    ) {
        newEntry.offline = true;
        await this.db_local
            .table('invoice')
            .add(newEntry)
            .then(async (data) => {
                await this.updateCorrelative(correlative[0].correlativeId);
                await this.db_local.customers
                    .where('customerId')
                    .equals(newEntry.customerId)
                    .modify((x) => {
                        x.balance = x.balance + newEntry.docTotal;
                    });

                newEntry.detail.map(
                    async (x) =>
                        await this.loadInventoryOffline(x.itemId, x.quantity)
                );
            })
            .catch((err) =>
                console.error('Error storing data locally:', err.message)
            );

        newEntry.detailDto = newEntry.detail;
        await this.printService.printInvoice(newEntry, 'Factura');
        await this.router.navigate(['/listado-facturas-venta'], {
            state: {},
        });
        this.display = false;
        Messages.Toas('Agregado Correctamente');
        this.index = 0;
        Messages.closeLoading();
    }

    formatNumberTo8Digits(num: number): string {
        return num.toString().padStart(8, '0');
    }

    async edit() {
        if (this.formInvoice.valid) {
            let newEntry = this.formInvoice.value as DocumentSaleModel;
            try {
                Messages.loading('Agregando', 'Editando factura de venta');

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
                this.printService.printInvoice(invoice[0], 'Factura');
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                await this.router.navigate(['/listado-facturas-venta'], {
                    state: {},
                });
                this.display = false;
                this.index = 0;
            } catch (ex) {
                let error = ex.error.message;
                if (error.includes('No existe esta orden')) {
                    if (newEntry.payConditionId === 1) {
                        newEntry.payment = this.payment;
                        this.payment.cashSum = this.doctotal;
                        this.payment.chekSum = 0;
                        this.payment.transferSum = 0;
                        this.payment.cardSum = 0;
                        this.payment.sellerId = newEntry.sellerId;
                    }
                    newEntry.id = this.invoice.id;
                    await this.db_local.invoice.update(
                        this.invoice.id,
                        newEntry
                    );
                    await this.router.navigate(['/listado-facturas-venta'], {
                        state: {},
                    });
                    this.display = false;
                    this.index = 0;
                } else {
                    Messages.closeLoading();
                    Messages.warning('Advertencia', ex.error.message);
                }
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
                if (this.isOffline) {
                    await this.db_local.invoice.delete(this.offlineId);
                    let result = await this.invoiceService.getInvoiceByDate(
                        this.formInvoice.value.docDate,
                        this.formInvoice.value.docDate
                    );
                    await this.router.navigate(['/listado-facturas-venta'], {
                        state: {},
                    });
                } else {
                    let invoice = await this.invoiceService.cancelInvoice(
                        newEntry.docId
                    );
                    await this.router.navigate(['/listado-facturas-venta'], {
                        state: {},
                    });
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
        this.printService.printInvoice(this.invoice, 'Factura');
    }

    async invoiceModify(invoice: DocumentSaleModel[]) {
        // this.invoiceList = invoice;
        invoice[0].complete = true;
        await this.router.navigate(['/listado-facturas-venta'], {
            state: {},
        });
        this.display = false;
    }

    async addTypeInvoice() {
        if (this.invoice.payConditionId !== 1) {
            // Preguntar al usuario si la factura es al crédito o al contado
            const userChoice = await this.confirmPaymentType();
            if (!userChoice) {
                return;
            }
        }
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

    async loadInventoryOffline(itemId: number, saleQuantity: number) {
        await this.db_local.inventory
            .where('itemId')
            .equals(itemId)
            .modify((x) => {
                x.stock = x.stock - saleQuantity;
            });
    }

    async updateCorrelative(correlativeId: number) {
        await this.db_local.correlative
            .where('correlativeId')
            .equals(correlativeId)
            .modify((x) => {
                x.currentCorrelative = x.currentCorrelative + 1;
            });
    }

    async exit() {
        await this.router.navigate(['/listado-facturas-venta'], {
            state: {},
        });
    }

    onCantidadFocus(item: DocumentSaleDetailModel) {
        if (item.quantity == 0) {
            item.quantity = null;
        }
    }
}
