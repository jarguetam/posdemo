import { element } from 'protractor';
import { AuthService } from 'src/app/service/users/auth.service';
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
import { DocumentDetailModel } from '../../models/document-detail';
import { DocumentModel } from './../../models/document';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemModel } from 'src/app/pages/items/models/items';
import { ItemsBrowserComponent } from 'src/app/pages/browser/items/items-browser/items-browser.component';
import { Messages } from 'src/app/helpers/messages';
import { OrderPurchaseService } from './../services/order.service';
import { PrintOrderPurchaseService } from '../services/print-order-purchase.service';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { SupplierBrowserComponent } from 'src/app/pages/browser/supplier/supplier-browser/supplier-browser.component';
import { SupplierModel } from 'src/app/pages/suppliers/models/supplier';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { InvoicePurchaseDialogComponent } from '../../invoice/invoice-purchase-dialog/invoice-purchase-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CompanyInfo } from 'src/app/models/company-info';

@Component({
    selector: 'app-orders-purchase-dialog',
    templateUrl: './orders-purchase-dialog.component.html',
    styleUrls: ['./orders-purchase-dialog.component.scss'],
})
export class OrdersPurchaseDialogComponent implements OnInit {
    @Output() OrderPurchaseModify = new EventEmitter<DocumentModel[]>();
    @ViewChild(ItemsBrowserComponent) ItemsBrowser: ItemsBrowserComponent;
    @ViewChild(SupplierBrowserComponent)
    SupplierBrowser: SupplierBrowserComponent;
    @ViewChild(InvoicePurchaseDialogComponent)
    InvoicePurchaseDialog: InvoicePurchaseDialogComponent;
    order: DocumentModel = new DocumentModel();
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
    detail: DocumentDetailModel[] = [];
    index = 0;
    barcodeValue: string = '';
    company: CompanyInfo;

    constructor(
        private formBuilder: FormBuilder,
        private orderService: OrderPurchaseService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintOrderPurchaseService,
        private auth: AuthService,
        private renderer: Renderer2
    ) {
        this.usuario = this.auth.UserValue;
        this.company = this.auth.CompanyValue;
    }
    ngOnInit(): void {}

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

    showDialog(orderNew: DocumentModel, isAdd: boolean) {
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
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formOrder = this.formBuilder.group({
            docId: [this.order.docId ?? 0],
            supplierId: [this.order.supplierId ?? 0, Validators.required],
            supplierCode: [this.order.supplierCode ?? '', Validators.required],
            supplierName: [this.order.supplierName ?? '', Validators.required],
            payConditionId: [
                this.order.payConditionId ?? 0,
                Validators.required,
            ],
            payConditionName: [
                this.order.payConditionName ?? 0,
                Validators.required,
            ],
            comment: [this.order.comment ?? '-', Validators.required],
            reference: [this.order.reference ?? '-', Validators.required],
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
            detail: [[]],
        });
    }

    new() {
        this.order = undefined;
        this.formOrder = undefined;
    }

    addLine(detail: DocumentDetailModel[]) {
        detail.push(
            new DocumentDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                stock: 0,
                price: 0,
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
            this.index--;
        }
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog('ItemActive');
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.findByBardCode(barcode, 'ItemActiveByBarcode');
        this.order.detail.push(
            new DocumentDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                stock: 0,
                price: 0,
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
            new DocumentDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                stock: 0,
                price: 0,
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

    browserItems(item: ItemModel) {
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
                this.order.detail[currentIndex].price = item.pricePurchase;
                let dueDateItem = new Date(); // fecha actual
                dueDateItem.setDate(dueDateItem.getDate() + 360);
                this.order.detail[currentIndex].dueDate = dueDateItem;
                this.order.detail[currentIndex].stock = item.stock;
                this.order.detail[currentIndex].isTax = item.tax;
                this.isTax= item.tax;
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.order.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.order.detail = this.order.detail.filter((x) => x.itemId != 0);
        this.calculate();
        this.renderer.selectRootElement('#quantity').focus();
    }

    showDialogSupplier() {
        this.SupplierBrowser.showDialog();
    }

    browserSupplier(supplier: SupplierModel) {
        this.order.supplierId = supplier.supplierId;
        this.order.supplierCode = supplier.supplierCode;
        this.order.supplierName = supplier.supplierName;
        this.order.payConditionId = supplier.payConditionId;
        this.order.payConditionName = supplier.payConditionName;
        this.order.payConditionDays = supplier.payConditionDays;
        let date = new Date(); // fecha actual
        date.setDate(date.getDate() + supplier.payConditionDays);
        this.order.dueDate = date;
        this.isTax = supplier.tax;
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

    async add() {
        if (this.formOrder.valid) {
            try {
                Messages.loading('Agregando', 'Agregando orden de compra');
                let newEntry = this.formOrder.value as DocumentModel;
                newEntry.detail = this.order.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.disccounts = this.descuento;
                newEntry.discountsTotal = this.descuentoTotal;
                newEntry.subTotal = this.subdoctotal;
                newEntry.tax = this.tax;
                newEntry.docTotal = this.doctotal;
                newEntry.dueDate = this.order.dueDate;
                newEntry.createBy = this.usuario.userId;
                let order = await this.orderService.addOrder(newEntry);
                this.printService.printOrder(order[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.OrderPurchaseModify.emit(order);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formOrder.valid) {
            try {
                Messages.loading('Agregando', 'Editando orden de compra');
                let newEntry = this.formOrder.value as DocumentModel;
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
                this.OrderPurchaseModify.emit(order);
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
                let newEntry = this.formOrder.value as DocumentModel;
                let order = await this.orderService.cancelOrder(newEntry.docId);
                this.OrderPurchaseModify.emit(order);
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

    invoiceModify(invoice: DocumentModel[]) {
        // this.invoiceList = invoice;
        invoice[0].complete = true;
        this.OrderPurchaseModify.emit(invoice);
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
        this.InvoicePurchaseDialog.showDialog(this.order, true);
    }
}
