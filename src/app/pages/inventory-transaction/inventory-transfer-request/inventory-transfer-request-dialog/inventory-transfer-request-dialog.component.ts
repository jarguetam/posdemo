import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { InventoryRequestTransfer } from '../models/inventory-request-transfer';
import { InventoryTransferRequestService } from '../service/inventory-transfer-request.service';
import { InventoryRequestTransferDetail } from '../models/inventory-request-transfer-detail';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemBrowserTransferComponent } from '../item-browser-transfer/item-browser-transfer.component';
import { ItemBrowserModel } from '../models/item-browser';
import { PrintInventoryRequestService } from '../service/print-request.service';

@Component({
    selector: 'app-inventory-transfer-request-dialog',
    templateUrl: './inventory-transfer-request-dialog.component.html',
    styleUrls: ['./inventory-transfer-request-dialog.component.scss'],
})
export class InventoryTransferRequestDialogComponent implements OnInit {
    @Output() InventoryRequestTransferModify = new EventEmitter<
        InventoryRequestTransfer[]
    >();
    @ViewChild(ItemBrowserTransferComponent)
    ItemsBrowser: ItemBrowserTransferComponent;
    transfer: InventoryRequestTransfer = new InventoryRequestTransfer();
    transferDetail = [];
    isAdd: boolean;
    disabled: boolean = false;
    formTransfer: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    docQuantity: number = 0;
    wareHouseList: WareHouseModel[];
    index = 0;
    barcodeValue: string = '';
    changeWareHouse: boolean = false;
    changeQuantityRequired: boolean = false;
    itemList: ItemBrowserModel[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private transferService: InventoryTransferRequestService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintInventoryRequestService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this.changeWareHouse =
            !this.authService.hasPermission('btn_edit_warehouse');


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

    showDialog(transferNew: InventoryRequestTransfer, isAdd: boolean) {
        this.changeQuantityRequired =isAdd ? true:
            this.authService.hasPermission('btn_edit_quantity_required');

            console.log(this.authService.hasPermission('btn_edit_quantity_required'))

        this.changeWareHouse =
            this.authService.hasPermission('btn_edit_warehouse');
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = !isAdd;
        this.transfer = transferNew;
        this.transferDetail = transferNew.detail;
        this.docQuantity = transferNew.qtyTotal;
        this.doctotal = transferNew.docTotal;
        if (!this.isAdd) {
            this.index = this.transfer.detail.length;
        }
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        this.formTransfer = this.formBuilder.group({
            transferRequestId: [this.transfer.transferRequestId ?? 0],
            comment: [this.transfer.comment ?? '--', Validators.required],
            docTotal: [this.transfer.docTotal ?? 0],
            qtyTotal: [this.transfer.qtyTotal ?? 0],
            fromWhsCode: [this.transfer.fromWhsCode ?? 0, Validators.required],
            toWhsCode: [
                this.transfer.toWhsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            createBy: [this.transfer.createBy ?? this.usuario.userId],
            detail: [[]],
        });
    }

    new() {
        this.transfer = undefined;
        this.formTransfer = undefined;
    }

    addLine(detail: InventoryRequestTransferDetail[]) {
        this.transfer.detail = this.transferService.itemList.map((item) => {
            const detail = new InventoryRequestTransferDetail();
            detail.itemCode = item.itemCode;
            detail.itemName = item.itemName;
            detail.itemId = item.itemId;
            detail.quantity = item.cantidad;
            detail.price = item.avgPrice;
            detail.quantityUnit = '1';
            detail.dueDate = item.dueDate;
            detail.stock = item.cantidad;
            detail.lineTotal = item.cantidad * item.avgPrice;
            detail.unitOfMeasureId = item.unitOfMeasureId;
            detail.unitOfMeasureName = item.unitOfMeasureName;
            return detail;
        });
        this.showDialogItem(this.index);
        this.index++;
    }

    deleteLine(itemId: number) {
        this.transfer.detail = this.transfer.detail.filter(
            (x) => x.itemId != itemId
        );
        this.calculate();
        this.index--;
    }

    showDialogItem(index: number) {
        const transformedDetails = this.transferDetail.map(
            this.transformToItemBrowserModel
        );
        console.log(transformedDetails)
        this.ItemsBrowser.showDialog(
            this.formTransfer.get('fromWhsCode').value,
            this.formTransfer.get('toWhsCode').value,
            transformedDetails.length == 0 ? this.itemList : transformedDetails
        );
    }

    transformToItemBrowserModel(
        detail: InventoryRequestTransferDetail
    ): ItemBrowserModel {
        return {
            itemId: detail.itemId,
            itemCode: detail.itemCode,
            barCode: '', // Asigna un valor adecuado si está disponible
            itemName: detail.itemName,
            stockAlmacenOrigen: detail.stock,
            stockAlmacenDestino: 0, // Asigna un valor adecuado si está disponible
            cantidad: detail.quantity,
            dueDate: detail.dueDate,
            avgPrice: detail.price,
            unitOfMeasureId: detail.unitOfMeasureId,
            unitOfMeasureName: detail.unitOfMeasureName,
            itemCategoryName: '', // Asigna un valor adecuado si está disponible
        };
    }

    findBarcode(barcode: string) {
        //  this.ItemsBrowser.index = this.index;
        // this.ItemsBrowser.findByBardCode(
        //     this.formTransfer.get('fromWhsCode').value,
        //     barcode
        // );
        this.transfer.detail.push(
            new InventoryRequestTransferDetail({
                toWhsCode: 0,
                toWhsName: '',
                fromWhsCode: 0,
                fromWhsName: '',
                itemCode: '',
                itemName: '',
                transferRequestDetailId: 0,
                transferRequestId: 0,
                itemId: 0,
                quantity: 1,
                quantityUnit: '0',
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
                stock: 0,
            })
        );
        this.index++;
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.transfer.detail.push(
            new InventoryRequestTransferDetail({
                toWhsCode: 0,
                toWhsName: '',
                fromWhsCode: 0,
                fromWhsName: '',
                itemCode: '',
                itemName: '',
                transferRequestDetailId: 0,
                transferRequestId: 0,
                itemId: 0,
                quantity: 1,
                quantityUnit: '0',
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
                stock: 0,
            })
        );
        //  this.ItemsBrowser.index = this.transfer.detail.length - 1;
        this.showDialogItem(this.transfer.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        this.itemList = this.transferService.itemList;
        this.transfer.detail = this.transferService.itemList.map((item) => {
            const detail = new InventoryRequestTransferDetail();
            detail.itemCode = item.itemCode;
            detail.itemName = item.itemName;
            detail.itemId = item.itemId;
            detail.quantity = item.cantidad;
            detail.quantityUnit = item.cantidad.toString();
            detail.price = item.avgPrice;
            detail.dueDate = item.dueDate;
            detail.stock = item.stockAlmacenOrigen;
            detail.lineTotal = item.cantidad * item.avgPrice;
            detail.unitOfMeasureId = item.unitOfMeasureId;
            detail.unitOfMeasureName = item.unitOfMeasureName;
            return detail;
        });
        this.calculate();
    }

    calculate() {
        setTimeout(() => {
            this.transfer.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            const total = this.transfer.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.transfer.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.doctotal = total;
            this.docQuantity = totalQty;
        }, 1000);
    }

    async add() {
        if (this.formTransfer.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando solicitud de transferencia de mercaderia'
                );

                let newTransfer = this.formTransfer
                    .value as InventoryRequestTransfer;
                newTransfer.detail = this.transfer.detail;
                newTransfer.detail.forEach(
                    (x) => (x.toWhsCode = newTransfer.toWhsCode)
                );
                newTransfer.detail.forEach(
                    (x) => (x.fromWhsCode = newTransfer.fromWhsCode)
                );
                newTransfer.docTotal = this.doctotal;
                newTransfer.qtyTotal = this.docQuantity;
                let transfer = await this.transferService.add(newTransfer);
                await this.printService.printInventoryRequest(transfer[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.transferService.itemList = [];
                this.itemList = [];
                this.InventoryRequestTransferModify.emit(transfer);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formTransfer.valid) {
            try {
                Messages.loading(
                    'Editando',
                    'Editando solicitud de transferencia de mercaderia'
                );

                let newTransfer = this.formTransfer
                    .value as InventoryRequestTransfer;
                newTransfer.detail = this.transfer.detail;
                newTransfer.detail.forEach(
                    (x) => (x.toWhsCode = newTransfer.toWhsCode)
                );
                newTransfer.detail.forEach(
                    (x) => (x.fromWhsCode = newTransfer.fromWhsCode)
                );
                newTransfer.docTotal = this.doctotal;
                newTransfer.qtyTotal = this.docQuantity;
                let transfer = await this.transferService.edit(newTransfer);
                await this.printService.printInventoryRequest(transfer[0]);
                this.transferService.itemList = [];
                this.itemList = [];
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.InventoryRequestTransferModify.emit(transfer);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print() {
        this.printService.printInventoryRequest(this.transfer);
    }
}
