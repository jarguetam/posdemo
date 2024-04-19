import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { CompanyInfo } from 'src/app/models/company-info';
import { User } from 'src/app/models/user';
import { ItemsBrowserComponent } from 'src/app/pages/browser/items/items-browser/items-browser.component';
import { SupplierBrowserComponent } from 'src/app/pages/browser/supplier/supplier-browser/supplier-browser.component';
import { ItemModel } from 'src/app/pages/items/models/items';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { SupplierModel } from 'src/app/pages/suppliers/models/supplier';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentModel } from '../../models/document';
import { DocumentDetailModel } from '../../models/document-detail';
import { OrderPurchaseService } from '../../orders/services/order.service';
import { PrintInvoicePurchaseService } from '../service/print-invoice-purchase.service';

@Component({
    selector: 'app-invoice-purchase-dialog',
    templateUrl: './invoice-purchase-dialog.component.html',
    styleUrls: ['./invoice-purchase-dialog.component.scss'],
})
export class InvoicePurchaseDialogComponent implements OnInit {
    @Output() InvoicePurchaseModify = new EventEmitter<DocumentModel[]>();
    @ViewChild(ItemsBrowserComponent) ItemsBrowser: ItemsBrowserComponent;
    @ViewChild(SupplierBrowserComponent)
    SupplierBrowser: SupplierBrowserComponent;
    invoice: DocumentModel = new DocumentModel();
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
    detail: DocumentDetailModel[] = [];
    index = 0;
    barcodeValue: string = '';
    company: CompanyInfo;

    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: OrderPurchaseService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintInvoicePurchaseService,
        private renderer: Renderer2
    ) {
        this.usuario = this.authService.UserValue;
        this.company = this.authService.CompanyValue;
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

    showDialog(invoiceNew: DocumentModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = false;
        this.invoice = invoiceNew;
        this.docQuantity = invoiceNew.docQty;
        this.doctotal = invoiceNew.docTotal;
        this.detail = invoiceNew.detail;
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
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        this.descuento = 0;
        this.formInvoice = this.formBuilder.group({
            docId: [this.invoice.docId ?? 0],
            docReference: [this.invoice.docReference ?? 0],
            supplierId: [this.invoice.supplierId ?? 0, Validators.required],
            supplierCode: [
                this.invoice.supplierCode ?? '',
                Validators.required,
            ],
            supplierName: [
                this.invoice.supplierName ?? '',
                Validators.required,
            ],
            payConditionId: [
                this.invoice.payConditionId ?? 0,
                Validators.required,
            ],
            payConditionName: [
                this.invoice.payConditionName ?? 0,
                Validators.required,
            ],
            comment: [
                this.invoice.comment ?? 'Factura de compra',
                Validators.required,
            ],
            reference: [this.invoice.reference ?? '-', Validators.required],
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
            detail: [[]],
        });
    }

    new() {
        this.invoice = undefined;
        this.formInvoice = undefined;
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
                price: 0,
                stock: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                isDelete: false,
                isTax:false,
                taxValue:0
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
        this.ItemsBrowser.showDialog('ItemActive');
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.findByBardCode(barcode, 'ItemActiveByBarcode');
        this.invoice.detail.push(
            new DocumentDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                docDetailId: 0,
                docId: 0,
                itemId: 0,
                quantity: 1,
                price: 0,
                stock: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                isDelete: false,
                isTax:false,
                taxValue:0
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.invoice.detail.push(
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
                isTax:false,
                taxValue:0
            })
        );
        this.ItemsBrowser.index = this.invoice.detail.length - 1;
        this.showDialogItem(this.invoice.detail.length - 1);
    }

    browserItems(item: ItemModel) {
        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.invoice.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.invoice.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                this.calculate();
            } else {
                this.invoice.detail[currentIndex].itemId = item.itemId;
                this.invoice.detail[currentIndex].itemCode = item.itemCode;
                this.invoice.detail[currentIndex].itemName = item.itemName;
                this.invoice.detail[currentIndex].unitOfMeasureId =
                    item.unitOfMeasureId;
                this.invoice.detail[currentIndex].unitOfMeasureName =
                    item.unitOfMeasureName;
                this.invoice.detail[currentIndex].price = item.pricePurchase;
                let dueDateItem = new Date(); // fecha actual
                dueDateItem.setDate(dueDateItem.getDate() + 360);
                this.invoice.detail[currentIndex].dueDate = dueDateItem;
                this.invoice.detail[currentIndex].stock = item.stock;
                this.invoice.detail[currentIndex].isTax = item.tax;
                this.isTax= item.tax;
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.invoice.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.invoice.detail = this.invoice.detail.filter((x) => x.itemId != 0);
        this.calculate();
        this.renderer.selectRootElement('#quantity').focus();
    }

    showDialogSupplier() {
        this.SupplierBrowser.showDialog();
    }

    browserSupplier(supplier: SupplierModel) {
        this.invoice.supplierId = supplier.supplierId;
        this.invoice.supplierCode = supplier.supplierCode;
        this.invoice.supplierName = supplier.supplierName;
        this.invoice.payConditionId = supplier.payConditionId;
        this.invoice.payConditionName = supplier.payConditionName;
        this.invoice.payConditionDays = supplier.payConditionDays;
        let date = new Date(); // fecha actual
        date.setDate(date.getDate() + supplier.payConditionDays);
        this.invoice.dueDate = date;
        this.isTax = supplier.tax;
        this._createFormBuild();
        this.calculate();
    }

    calculate() {
        setTimeout(() => {
            this.invoice.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            const total = this.invoice.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            this.invoice.detail.forEach(
                (x) =>
                    (x.taxValue = x.isTax
                        ? x.lineTotal * this.company.taxValue
                        : 0)
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

    async add() {
        if (this.formInvoice.valid) {
            try {
                Messages.loading('Agregando', 'Agregando factura de compra');

                let newEntry = this.formInvoice.value as DocumentModel;
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
                this.printService.printInvoice(invoice[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.InvoicePurchaseModify.emit(invoice);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formInvoice.valid) {
            try {
                Messages.loading('Agregando', 'Editando factura de compra');
                let newEntry = this.formInvoice.value as DocumentModel;
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
                this.InvoicePurchaseModify.emit(invoice);
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
                let newEntry = this.formInvoice.value as DocumentModel;
                let invoice = await this.invoiceService.cancelInvoice(
                    newEntry.docId
                );
                this.InvoicePurchaseModify.emit(invoice);
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
        this.printService.printInvoice(this.invoice);
    }
}
