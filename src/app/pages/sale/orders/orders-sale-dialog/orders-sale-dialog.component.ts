import { CompanyInfo } from 'src/app/models/company-info';
import { SellerModel } from './../../../seller/models/seller';
import { DocumentSaleModel } from './../../models/document-model';
import { SalesService } from './../../services/sales.service';
import { DocumentSaleDetailModel } from './../../models/document-detail-model';
import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { InvoiceSaleDialogComponent } from '../../invoice/invoice-sale-dialog/invoice-sale-dialog.component';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { ItemsBrowserPriceSalesComponent } from 'src/app/pages/browser/items/items-browser-price-sales/items-browser-price-sales.component';
import { CustomerBrowserComponent } from 'src/app/pages/browser/customer/customer-browser/customer-browser.component';
import { CustomerModel } from 'src/app/pages/customers/models/customer';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { PrintOrderSaleService } from '../../services/print-order-sale.service';
import { PayCondition } from 'src/app/models/paycondition';
import { CommonService } from 'src/app/service/common.service';
import { ConnectionService, ConnectionState } from 'ng-connection-service';
import { tap } from 'rxjs';
import { DbLocalService } from 'src/app/service/db-local.service';

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
    @ViewChild(InvoiceSaleDialogComponent)
    InvoiceSaleDialog: InvoiceSaleDialogComponent;
    order: DocumentSaleModel = new DocumentSaleModel();
    @ViewChildren('quantity') quantityInputs: QueryList<any>;
    isAdd: boolean;
    isTax: boolean = false;
    disabled: boolean = false;
    disabledwsh: boolean = false;
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
    sellerList: SellerModel[];
    index = 0;
    barcodeValue: string = '';
    company: CompanyInfo;
    payConditionList: PayCondition[];
    currentState!: ConnectionState;
    status: boolean;
    isMobile: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private orderService: SalesService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintOrderSaleService,
        private auth: AuthService,
        private sellerService: SellerService,
        private commonService: CommonService,
        private connectionService: ConnectionService,
        private db_local: DbLocalService
    ) {
        this.usuario = this.auth.UserValue;
        this.company = this.auth.CompanyValue;
        this.isMobile = this.detectMobile();
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

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
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

    showDialog(orderNew: DocumentSaleModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = false;
        this.order = orderNew;
        this.docQuantity = orderNew.docQty;
        this.doctotal = orderNew.docTotal;
        this.detail = orderNew.detail;
        this.doctotal = orderNew.docTotal;
        this.subdoctotal = orderNew.subTotal;
        this.descuento = orderNew.disccounts;
        this.descuentoTotal = orderNew.discountsTotal;
        this.docQuantity = orderNew.docQty;
        this.tax = orderNew.tax;
        this.isTax = orderNew.taxSupplier;
        if (!isAdd) {
            this.index = orderNew.detail.length;
        }
        this._createFormBuild();
        this._getWareHouse();
        this._getSellers();
        this.payConditionList = this.payConditionList
            .filter(
                (x) =>
                    x.payConditionId === 1 ||
                    x.payConditionId === orderNew.payConditionId
            )
            .sort((a, b) => b.payConditionId - a.payConditionId);
        this.disabledwsh = this.usuario.role == 'Vendedor' ? true : false;
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formOrder = this.formBuilder.group({
            docId: [this.order.docId ?? 0],
            customerId: [this.order.customerId ?? 0, Validators.required],
            customerCode: [this.order.customerCode ?? '', Validators.required],
            customerName: [this.order.customerName ?? '', Validators.required],
            customerRTN: [this.order.customerRTN ?? ''],
            customerAddress: [this.order.customerAddress ?? ''],
            sellerId: [
                this.order.sellerId ?? this.usuario.sellerId,
                Validators.required,
            ],
            payConditionId: [
                this.order.payConditionId ?? 0,
                Validators.required,
            ],
            payConditionName: [
                this.order.payConditionName ?? 0,
                Validators.required,
            ],
            comment: [this.order.comment ?? '--'],
            reference: [this.order.reference ?? '--'],
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
            this.order.priceListId
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
            })
        );
        this.ItemsBrowser.index = this.order.detail.length - 1;
        this.showDialogItem(this.order.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.order.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.order.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                this.calculate();
            } else {
                this.order.detail[currentIndex].itemId = item.itemId;
                this.order.detail[currentIndex].itemCode = item.itemCode;
                this.order.detail[currentIndex].itemName = item.itemName;
                this.order.detail[currentIndex].unitOfMeasureId =
                    item.unitOfMeasureId;
                this.order.detail[currentIndex].unitOfMeasureName =
                    item.unitOfMeasureName;
                this.order.detail[currentIndex].price = item.priceSales;
                this.order.detail[currentIndex].cost = item.avgPrice;
                this.order.detail[currentIndex].dueDate = item.dueDate;
                this.order.detail[currentIndex].stock = item.stock;
                this.order.detail[currentIndex].isTax = item.tax;
                this.isTax = item.tax;
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.order.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.order.detail = this.order.detail.filter((x) => x.itemId != 0);
        setTimeout(() => {
            this.calculate();
            const lastQuantityInput = this.quantityInputs.last;
            if (lastQuantityInput) {
                lastQuantityInput.nativeElement.focus();
            }
        }, 500);
    }

    showDialogCustomer() {
        this.CustomerBrowser.showDialog(this.usuario.sellerId);
    }

    browserCustomer(customer: CustomerModel) {
        this.order.customerId = customer.customerId;
        this.order.customerCode = customer.customerCode;
        this.order.customerName = customer.customerName;
        this.order.customerAddress = customer.address;
        this.order.customerRTN = customer.rtn;
        this.order.payConditionId = customer.payConditionId;
        this.order.payConditionName = customer.payConditionName;
        this.order.payConditionDays = customer.payConditionDays;
        this.order.priceListId = customer.listPriceId;
        let date = new Date(); // fecha actual
        date.setDate(date.getDate() + customer.payConditionDays);
        this.order.dueDate = date;
        this.isTax = customer.tax;
        this.payConditionList = this.payConditionList
            .filter(
                (x) =>
                    x.payConditionId === 1 ||
                    x.payConditionId === customer.payConditionId
            )
            .sort((a, b) => b.payConditionId - a.payConditionId);
        this._createFormBuild();
        this.calculate();
    }

    calculate() {
        setTimeout(() => {
            this.order.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            const total = this.order.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.order.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.order.detail.forEach(
                (x) =>
                    (x.taxValue = x.isTax
                        ? x.lineTotal * this.company.taxValue
                        : 0)
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

    async add() {
        if (this.formOrder.valid) {
            let newEntry = this.formOrder.value as DocumentSaleModel;
            try {
                Messages.loading('Agregando', 'Agregando orden de venta');
                if (this.disabledwsh){
                    newEntry.whsCode = this.usuario.whsCode
                }
                newEntry.detail = this.order.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.disccounts = this.descuento;
                newEntry.discountsTotal = this.descuentoTotal;
                newEntry.subTotal = this.subdoctotal;
                newEntry.tax = this.tax;
                newEntry.docTotal = this.doctotal;
                newEntry.dueDate = this.order.dueDate;
                newEntry.createBy = this.usuario.userId;
                if (this.status) {
                    let order = await this.orderService.addOrder(newEntry);
                    this.printService.printOrder(order[0]);
                    this.OrderSaleModify.emit(order);
                } else {
                    await this.db_local
                        .table('orderSales')
                        .add(newEntry)
                        .then((data) =>
                            console.log('Data stored locally:', data)
                        )
                        .catch((err) => Messages.warning(err.message));
                    let orderOffline = await this.db_local.orderSales.toArray();
                    this.printService.printOrder(orderOffline[0]);
                    this.OrderSaleModify.emit(orderOffline);
                }
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
                let message = ex.error.message.toString();
                if (!message.includes('Error')) {
                    await this.db_local
                        .table('orderSales')
                        .add(newEntry)
                        .then((data) =>
                            console.log('Data stored locally:', data)
                        )
                        .catch((err) => Messages.warning(err.message));
                    let orderOffline = await this.db_local.orderSales.toArray();
                    this.printService.printOrder(orderOffline[0]);
                    this.OrderSaleModify.emit(orderOffline);
                }
            }
        }
    }

    async edit() {
        if (this.formOrder.valid) {
            try {
                Messages.loading('Agregando', 'Editando orden de venta');

                let newEntry = this.formOrder.value as DocumentSaleModel;
                let newLine = this.order.detail.filter(
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
                let order = await this.orderService.updateOrder(newEntry);
                this.printService.printOrder(order[0]);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.OrderSaleModify.emit(order);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async cancelOrder() {
        let cancel = await Messages.question(
            'Cancelacion',
            'Cancelar este pedido es irreversible. ¿Seguro desea continuar?'
        );
        if (cancel) {
            try {
                let newEntry = this.formOrder.value as DocumentSaleModel;
                let order = await this.orderService.cancelOrder(newEntry.docId);
                this.OrderSaleModify.emit(order);
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
        this.printService.printOrder(this.order);
    }

    invoiceModify(invoice: DocumentSaleModel[]) {
        // this.invoiceList = invoice;
        invoice[0].complete = true;
        this.OrderSaleModify.emit(invoice);
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
        this.InvoiceSaleDialog.showDialog(this.order, true);
    }
}
