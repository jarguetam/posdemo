import { CompanyInfo } from 'src/app/models/company-info';
import { SellerModel } from './../../../seller/models/seller';
import { DocumentSaleModel } from './../../models/document-model';
import { SalesService } from './../../services/sales.service';
import { DocumentSaleDetailModel } from './../../models/document-detail-model';
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
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { ItemsBrowserPriceSalesComponent } from 'src/app/pages/browser/items/items-browser-price-sales/items-browser-price-sales.component';
import { CustomerBrowserComponent } from 'src/app/pages/browser/customer/customer-browser/customer-browser.component';
import { CustomerModel } from 'src/app/pages/customers/models/customer';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { PayCondition } from 'src/app/models/paycondition';
import { CommonService } from 'src/app/service/common.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { combineLatest, tap } from 'rxjs';
import { DbLocalService } from 'src/app/service/db-local.service';
import { PaymentMetodDialogComponent } from 'src/app/pages/common/payment-metod-dialog/payment-metod-dialog.component';
import { Table } from 'primeng/table';
import { ListModel } from '../../models/list-model';
import { Correlative } from 'src/app/models/correlative-sar';
import { PaymentSaleModel } from 'src/app/pages/sales-payment/models/payment-sale-model';
import { Router } from '@angular/router';
import { PrintEscPosService } from '../../services/print-esc-pos.service';
import { v4 as uuidv4 } from 'uuid';
import { ItemService } from 'src/app/pages/items/service/items.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Component({
    selector: 'app-orders-sale-dialog',
    templateUrl: './orders-sale-dialog.component.html',
    styleUrls: ['./orders-sale-dialog.component.scss'],
})
export class OrdersSaleDialogComponent implements OnInit {
    @Output() OrderSaleModify = new EventEmitter<DocumentSaleModel[]>();
    @ViewChild(ItemsBrowserPriceSalesComponent)
    ItemsBrowser: ItemsBrowserPriceSalesComponent;
    @ViewChild(CustomerBrowserComponent)
    CustomerBrowser: CustomerBrowserComponent;
    @ViewChild(PaymentMetodDialogComponent)
    PaymentMetodDialog: PaymentMetodDialogComponent;
    @ViewChild('dt') vsTable: Table;
    @ViewChildren('quantity') quantityInputs: QueryList<any>;
    @ViewChild('swiperRow') swiperRow: ElementRef;
    order: DocumentSaleModel = new DocumentSaleModel();
    isAdd: boolean;
    isTax: boolean = false;
    disabled: boolean = false;
    formOrder: FormGroup;
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
    title: string = 'Agregar pedido';

    constructor(
        private formBuilder: FormBuilder,
        private orderService: SalesService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintEscPosService,
        private auth: AuthService,
        private sellerService: SellerService,
        private commonService: CommonService,
        private db_local: DbLocalService,
        private connectionService: ConnectionService,
        private router: Router,
        private itemService: ItemService,
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

    ngOnInit(): void {
        if (history.state.order) {
            this.isAdd = false;
            this.title = 'Editar pedido';
            this.showDialog(history.state.order, false);
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

    async showDialog(invoiceNew: DocumentSaleModel, isAdd: boolean) {
        if (invoiceNew.id != null && invoiceNew.id !== 0) {
            this.isOffline = true;
            this.offlineId = invoiceNew.id;
        }
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        if (!this.isAdd) {
            this.title = 'Pedido de venta';
        }
        this.disabled = isAdd ? false : true;
        this.order = invoiceNew;
        this.detail = invoiceNew.detail;
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
        this.disabledwsh = this.usuario.role == 'Vendedor' ? true : false;
        this._createFormBuild();
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formOrder = this.formBuilder.group({
            docId: [this.order.docId ?? 0],
            docReference: [this.order.docReference ?? 0],
            customerId: [this.order.customerId ?? 0, Validators.required],
            customerCode: [this.order.customerCode ?? '', Validators.required],
            customerName: [this.order.customerName ?? '', Validators.required],
            customerRTN: [this.order.customerRTN ?? ''],
            customerAddress: [this.order.customerAddress ?? ''],
            docDate: [this.order.docDate ?? new Date()],
            sellerId: [
                this.order.sellerId ?? this.usuario.sellerId,
                Validators.required,
            ],
            correlativeId: [
                this.order.correlativeId ?? this.usuario.sarCorrelativeId,
                Validators.required,
            ],
            payConditionId: [
                this.order.payConditionId ?? 0,
                Validators.required,
            ],
            payConditionName: [this.order.payConditionName ?? 0],
            comment: [this.order.comment ?? 'Pedido de venta'],
            reference: [this.order.reference ?? '-'],
            subTotal: [this.order.subTotal ?? 0],
            tax: [this.order.tax ?? 0],
            disccounts: [this.order.disccounts ?? 0],
            discountsTotal: [this.order.discountsTotal ?? 0],
            docTotal: [this.order.docTotal ?? 0],
            docQty: [this.order.docQty ?? 0],
            whsCode: [
                this.order.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            createBy: [this.order.createBy ?? this.usuario.userId],
            priceListId: [this.order.priceListId ?? 0],
            detail: [[]],
        });

        if (this.disabledwsh) this.formOrder.get('whsCode').disable();
    }

    new() {
        this.order = undefined;
        this.formOrder = undefined;
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
        this.showDialogItem(this.order.detail.length - 1);
        this.index++;
    }

    deleteLine(itemId) {
        if (!this.isAdd) {
            this.detail.find((x) => x.itemCode === itemId).isDelete = true;
            this.order.detail.find((x) => x.itemCode === itemId).isDelete =
                true;
            this.order.detail = this.order.detail.filter(
                (x) => x.isDelete == false
            );
            this.calculate();
            this.index--;
        } else {
            this.order.detail = this.order.detail.filter(
                (x) => x.itemCode != itemId
            );
            this.calculate();
            this.index--;
        }
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog(
            this.formOrder.get('whsCode').value,
            this.formOrder.get('customerId').value,
            this.order.priceListId,
            this.order.detail
        );
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.findByBardCode(
            this.formOrder.get('whsCode').value,
            this.formOrder.get('customerId').value,
            this.order.priceListId,
            barcode
        );
        this.order.detail.push(
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
        this.ItemsBrowser.index = this.order.detail.length - 1;
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.order.detail.push(
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
        this.ItemsBrowser.index = this.order.detail.length - 1;
        this.showDialogItem(this.order.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        this.order.detail = this.itemService.itemsListService.map((item) => {
            const detail = new DocumentSaleDetailModel();
            detail.itemCode = item.itemCode;
            detail.itemName = item.itemName;
            detail.itemId = item.itemId;
            detail.quantity = item.quantity;
            detail.price = item.priceSales;
            detail.dueDate = item.dueDate;
            detail.stock = item.stock;
            detail.cost = item.avgPrice;
            detail.isTax = item.tax;
            detail.lineTotal = item.quantity * item.priceSales;
            detail.unitOfMeasureId = item.unitOfMeasureId;
            detail.unitOfMeasureName = item.unitOfMeasureName;
            return detail;
        });

        this.ItemsBrowser.index = -1;
        let deleteIndex = this.order.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.order.detail = this.order.detail.filter((x) => x.itemId != 0);
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
        this.order.customerId = customer.customerId;
        this.order.customerCode = customer.customerCode;
        this.order.customerName = customer.customerName;
        this.order.customerAddress = customer.address;
        this.order.customerRTN = customer.rtn;
        this.order.payConditionId = customer.payConditionId;
        this.order.payConditionName = customer.payConditionName;
        this.order.payConditionDays = customer.payConditionDays;
        this.order.priceListId = customer.listPriceId;
        const currentDate = new Date();

        let date = new Date(); // fecha actual
        date = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        );
        date.setDate(date.getDate() + customer.payConditionDays);

        this.order.dueDate = date;
        this.isTax = customer.tax;
        this._createFormBuild();
        this.calculate();
    }

    calculate() {
        setTimeout(() => {
            this.order.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            this.order.detail.forEach(
                (x) =>
                    (x.taxValue = x.isTax
                        ? x.lineTotal * this.company.taxValue
                        : 0)
            );
            const total = this.order.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.order.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.subdoctotal = total;
            this.descuentoTotal = (this.subdoctotal * this.descuento) / 100;
            this.tax = this.order.detail.reduce(
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

    async add(newEntry: DocumentSaleModel) {
        if (!this.formOrder.valid) return;
        try {
            if (this.disabledwsh) {
                newEntry.whsCode = this.usuario.whsCode;
                newEntry.docId = 0;
            }
            newEntry.detail = this.order.detail;
            newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
            newEntry.disccounts = this.descuento;
            newEntry.discountsTotal = this.descuentoTotal;
            newEntry.subTotal = this.subdoctotal;
            newEntry.payConditionName = this.payConditionList.find(
                (x) => x.payConditionId == newEntry.payConditionId
            ).payConditionName;
            newEntry.tax = this.tax;
            newEntry.docTotal = this.doctotal;
            if (newEntry.docDate) {
                const date = new Date(newEntry.docDate);
                date.setHours(0, 0, 0, 0);
                newEntry.docDate = date;
            }
            if (this.hasNullQuantities(newEntry.detail)) {
                Messages.closeLoading();
                Messages.warning('Advertencia', 'Ingrese la cantidad');
                return;
            }
            Messages.loading('Agregando', 'Agregando pedido de venta');
            newEntry.dueDate = this.order.dueDate;
            newEntry.createBy = this.usuario.userId;
            newEntry.sellerName = this.sellerList.find(
                (x) => x.sellerId === newEntry.sellerId
            ).sellerName;
            newEntry.createByName = this.usuario.name;
            const currentDate = new Date();
            const hondurasOffset = -6 * 60; // Honduras tiene una diferencia horaria de -6 horas respecto a UTC
            const localDate = new Date(
                currentDate.getTime() +
                    (currentDate.getTimezoneOffset() + hondurasOffset) * 60000
            );
            const offset = localDate.getTimezoneOffset();
            newEntry.docDate = new Date(localDate.getTime() - (offset * 60 * 1000));
            newEntry.uuid = uuidv4();

            if (this.status) {
                let order = await this.orderService.addOrder(newEntry);
                await this.printService.printInvoice(order[0], 'Pedido');
                await this.router.navigate(['/listado-pedidos'], {
                    state: {},
                });
                await this.router.navigate(['/listado-pedidos'], {
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
            let message: string;
            if (ex.error && ex.error.message) {
                message = ex.error.message.toString();
            } else if (ex.message) {
                message =
                    'La solicitud tardó demasiado en enviarse y se guardará localmente para su procesamiento posterior.';
            } else {
                message = 'Error desconocido';
            }
            Messages.closeLoading();
            await Messages.warning('Advertencia', message);
            if (!message.includes('Error')) {
                await this.addOffline(newEntry);
            }
        }
    }

    hasNullQuantities(details: any[]): boolean {
        return details.some((item) => item.quantity == null);
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

            const currentDate = new Date();
            const hondurasOffset = -6 * 60; // Honduras tiene una diferencia horaria de -6 horas respecto a UTC
            const localDate = new Date(
                currentDate.getTime() +
                    (currentDate.getTimezoneOffset() + hondurasOffset) * 60000
            );
            newEntry.docDate = localDate;

            await this.addOrderToLocal(newEntry);
        } catch (error) {
            Messages.warning(error);
            Messages.closeLoading();
        }
    }

    async addOrderToLocal(newEntry: DocumentSaleModel) {
        await this.db_local
            .table('orderSales')
            .add(newEntry)
            .then(async (data) => {
                newEntry.detail.map(
                    async (x) =>
                        await this.loadInventoryOffline(x.itemId, x.quantity)
                );
            })
            .catch((err) =>
                console.error('Error storing data locally:', err.message)
            );
        let invoiceOffline = await this.db_local.orderSales.toArray();

        newEntry.detailDto = newEntry.detail;
        await this.printService.printInvoice(newEntry, 'Pedido');
        await this.router.navigate(['/listado-pedidos'], {
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
        if (this.formOrder.valid) {
            let newEntry = this.formOrder.value as DocumentSaleModel;
            try {
                Messages.loading('Agregando', 'Editando pedido de venta');
                let newLine = this.order.detail.filter(
                    (x) => x.docDetailId == 0 || x.docDetailId === undefined
                );
                newLine.forEach((x) => (x.docId = newEntry.docId));
                this.detail = this.order.detail.filter(
                    (x) => x.docDetailId != 0
                );
                newLine.forEach((newItem) => {
                    if (
                        !this.detail.some(
                            (existingItem) =>
                                existingItem.itemId === newItem.itemId
                        )
                    ) {
                        this.detail.push(newItem);
                    }
                });
                newEntry.detail = this.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.disccounts = this.descuento;
                newEntry.discountsTotal = this.descuentoTotal;
                newEntry.subTotal = this.subdoctotal;
                newEntry.tax = this.tax;
                newEntry.docTotal = this.doctotal;
                newEntry.createBy = this.usuario.userId;
                let order = await this.orderService.updateOrder(newEntry);
                this.printService.printInvoice(order[0], 'Pedido');
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                await this.router.navigate(['/listado-pedidos'], {
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
                    newEntry.id = this.order.id;
                    await this.db_local.orderSales.update(
                        this.order.id,
                        newEntry
                    );
                    let invoiceOffline =
                        await this.db_local.orderSales.toArray();
                    await this.router.navigate(['/listado-pedidos'], {
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
            'Cancelar esta pedido es irreversible. ¿Seguro desea continuar?'
        );
        if (cancel) {
            try {
                let newEntry = this.formOrder.value as DocumentSaleModel;
                if (this.isOffline) {
                    await this.db_local.orderSales.delete(this.offlineId);
                    let result = await this.orderService.getInvoiceByDate(
                        this.formOrder.value.docDate,
                        this.formOrder.value.docDate
                    );
                    await this.router.navigate(['/listado-pedidos'], {
                        state: {},
                    });
                } else {
                    let order = await this.orderService.cancelOrder(
                        newEntry.docId
                    );
                    await this.router.navigate(['/listado-pedidos'], {
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
        this.printService.printInvoice(this.order, 'Pedido');
    }

    async invoiceModify(order: DocumentSaleModel[]) {
        // this.invoiceList = order;
        order[0].complete = true;
        await this.router.navigate(['/listado-pedidos'], {
            state: {},
        });
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
        this.order.docReference = this.order.docId;
        this.order.detail.forEach((doc) => (doc.docDetailId = 0));
        // this.InvoiceSaleDialog.showDialog(this.order, true);
    }

    addTypeInvoice() {
        let newEntry = this.formOrder.value as DocumentSaleModel;
        if (newEntry.payConditionId === 1) {
            let newEntryPayment = this.formOrder.value as DocumentSaleModel;
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

    async loadInventoryOffline(itemId: number, saleQuantity: number) {
        await this.db_local.inventory
            .where('itemId')
            .equals(itemId)
            .modify((x) => {
                x.stock = x.stock - saleQuantity;
            });
    }

    async exit() {
        await this.router.navigate(['/listado-pedidos'], {
            state: {},
        });
    }

    async copyToInvoice() {
        if (!this.auth.hasPermission('btn_add')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso.'
            );
            return;
        }
        this.order.docReference = this.order.docId;
        this.order.detail.forEach((doc) => (doc.docDetailId = 0));
        this.order.reference = `Basado en pedido N°: ${this.order.docId}`;
        let invoice = this.order;
        invoice.detailDto = this.order.detail;
        await this.router.navigate(['/listado-facturas-venta/factura-movil'], {
            state: { invoice },
        });
    }

    onCantidadFocus(item: DocumentSaleDetailModel) {
        if (item.quantity == 0) {
            item.quantity = null;
        }
    }
}
