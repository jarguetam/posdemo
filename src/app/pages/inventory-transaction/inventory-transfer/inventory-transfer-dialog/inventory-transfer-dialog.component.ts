import { AuthService } from 'src/app/service/users/auth.service';
import { Component, EventEmitter, HostListener, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryTransferDetailModel } from '../models/inventory-transfer-detail';
import { InventoryTransferModel } from '../models/inventory-transfer';
import { InventoryTransferService } from '../services/inventory-transfer.service';
import { ItemModel } from 'src/app/pages/items/models/items';
import { ItemsBrowserComponent } from 'src/app/pages/browser/items/items-browser/items-browser.component';
import { ItemsBrowserWareHouseComponent } from 'src/app/pages/browser/items/items-browser-ware-house/items-browser-ware-house.component';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { Messages } from 'src/app/helpers/messages';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { PrintTransferService } from '../services/print-transfer.service';
import { ItemService } from 'src/app/pages/items/service/items.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory-transfer-dialog',
  templateUrl: './inventory-transfer-dialog.component.html',
  styleUrls: ['./inventory-transfer-dialog.component.scss']
})
export class InventoryTransferDialogComponent implements OnInit {
    @Output() InventorytransferModify = new EventEmitter<InventoryTransferModel[]>();
    @ViewChild(ItemsBrowserWareHouseComponent) ItemsBrowser: ItemsBrowserWareHouseComponent;
    transfer: InventoryTransferModel = new InventoryTransferModel();
    @ViewChildren('quantity') quantityInputs: QueryList<any>;
    isAdd: boolean;
    disabled: boolean = false;
    formTransfer: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number=0;
    docQuantity: number=0;
    wareHouseList: WareHouseModel[];
    index = 0;
    barcodeValue: string = '';
    items: ItemWareHouse[];

    constructor(
        private formBuilder: FormBuilder,
        private transferService: InventoryTransferService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintTransferService,
        private itemServices: ItemService,
        private datePipe: DatePipe,
    ) {
        this.usuario = this.authService.UserValue;
    }
    ngOnInit(): void {}

    async _getWareHouse() {
        try {
            this.loading = true;
            this.wareHouseList = await this.wareHouseService.getWarehouseActive();
            this.wareHouseList.unshift({
                whsCode: 0,
                whsName: 'Seleccione un almacen',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async showDialog(transferNew: InventoryTransferModel, isAdd: boolean) {
        debugger
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = !isAdd;
        this.transfer = transferNew;
        //this.transfer.fromWhsCode= null;
        this.docQuantity = transferNew.qtyTotal;
        this.doctotal = transferNew.docTotal;
        this._createFormBuild();
        this._getWareHouse();
        if(this.isAdd){
            await this.findStockAviables(this.transfer.fromWhsCode);
            this.transfer.detail.map(x=> x.stock= this.items.find(y=> y.itemId==x.itemId).stock)
        }
    }

    _createFormBuild() {
        this.formTransfer = this.formBuilder.group({
            transferId: [this.transfer.transferId ?? 0],
            transferDate:  [
                new Date(),
            ],
            comment: [this.transfer.comment ?? '--', Validators.required],
            docTotal: [this.transfer.docTotal ??0],
            qtyTotal: [this.transfer.qtyTotal ?? 0],
            fromWhsCode: [this.transfer.fromWhsCode ?? this.usuario.whsCode, Validators.required],
            toWhsCode: [this.transfer.toWhsCode ?? 0, Validators.required],
            createBy: [this.transfer.createBy ?? this.usuario.userId],
            transferRequestId: [this.transfer.transferRequestId ?? 0],
            detail: [[]],
        });
    }

    async findStockAviables(whscode: number){
        this.items = await this.itemServices.getItemsWareHouse(whscode);
    }

    new() {
        this.transfer = undefined;
        this.formTransfer = undefined;
    }

    addLine(detail: InventoryTransferDetailModel[]) {
        detail.push(
            new InventoryTransferDetailModel({
                toWhsCode: 0,
                toWhsName: '',
                fromWhsCode:0,
                fromWhsName: '',
                itemCode: '',
                itemName: '',
                transferDetailId: 0,
                transferId: 0,
                itemId: 0,
                quantity: 1,
                quantityUnit: '1',
                stock:0,
                unitOfMeasureId:0,
                unitOfMeasureName:'',
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
            })
        );
        this.showDialogItem(this.index);
        this.index++;
    }

    deleteLine(itemId: number) {
        this.transfer.detail= this.transfer.detail.filter(
            (x) => x.itemId != itemId
        );
        this.calculate();
        this.index--;
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog(this.formTransfer.get('fromWhsCode').value, true);
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.index = this.index;
        this.ItemsBrowser.findByBardCode(
            this.formTransfer.get('fromWhsCode').value,
            barcode
        );
        this.transfer.detail.push(
            new InventoryTransferDetailModel({
                toWhsCode: 0,
                toWhsName: '',
                fromWhsCode:0,
                fromWhsName: '',
                itemCode: '',
                itemName: '',
                transferDetailId: 0,
                transferId: 0,
                itemId: 0,
                quantity: 1,
                quantityUnit: '1',
                stock:0,
                unitOfMeasureId:0,
                unitOfMeasureName:'',
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
            })
        );
        this.index++;
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.transfer.detail.push(
            new InventoryTransferDetailModel({
                toWhsCode: 0,
                toWhsName: '',
                fromWhsCode:0,
                fromWhsName: '',
                itemCode: '',
                itemName: '',
                transferDetailId: 0,
                transferId: 0,
                itemId: 0,
                quantity: 1,
                quantityUnit: '1',
                stock:0,
                unitOfMeasureId:0,
                unitOfMeasureName:'',
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
            })
        );
        this.ItemsBrowser.index = this.transfer.detail.length - 1;
        this.showDialogItem(this.transfer.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {

        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.transfer.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.transfer.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                    this.calculate();
            } else {
            this.transfer.detail[currentIndex].itemId = item.itemId;
            this.transfer.detail[currentIndex].itemCode = item.itemCode;
            this.transfer.detail[currentIndex].itemName = item.itemName;
            this.transfer.detail[currentIndex].price = item.avgPrice;
            this.transfer.detail[currentIndex].dueDate = item.dueDate;
            this.transfer.detail[currentIndex].unitOfMeasureId = item.unitOfMeasureId;
            this.transfer.detail[currentIndex].unitOfMeasureName = item.unitOfMeasureName;
            this.transfer.detail[currentIndex].stock = item.stock;
            this.transfer.detail[currentIndex].quantityUnit = '1';
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.transfer.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.transfer.detail = this.transfer.detail.filter((x) => x.itemId != 0);
        setTimeout(() => {
            const lastQuantityInput = this.quantityInputs.last;
            if (lastQuantityInput) {
                lastQuantityInput.nativeElement.focus();
            }
        }, 300);
        this.calculate();
    }

    calculate() {
        setTimeout(() => {
            this.transfer.detail.forEach(x=> x.lineTotal = x.quantity*x.price);
            const total =  this.transfer.detail.reduce((acumulador, producto) => acumulador + producto.lineTotal, 0);
            const totalQty =  this.transfer.detail.reduce((acc, item) => acc + Number(item.quantity), 0);
            this.doctotal = total;
            this.docQuantity = totalQty;
          }, 500);

    }

    async add() {
        if (this.formTransfer.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando transferencia de mercaderia'
                );

                let newTransfer = this.formTransfer.value as InventoryTransferModel;

                // Ajustar la zona horaria para que se guarde la hora local correcta
                if (newTransfer.transferDate) {
                    const date = new Date(newTransfer.transferDate);
                    const offset = date.getTimezoneOffset();
                    newTransfer.transferDate = new Date(date.getTime() - (offset * 60 * 1000));
                }

                newTransfer.detail = this.transfer.detail;
                newTransfer.detail.forEach(x=> x.toWhsCode = newTransfer.toWhsCode);
                newTransfer.detail.forEach(x=> x.fromWhsCode = newTransfer.fromWhsCode);
                newTransfer.docTotal = this.doctotal;
                newTransfer.qtyTotal = this.docQuantity;
                let transfer = await this.transferService.add(newTransfer);
                this.printService.printRequestTransfer(transfer[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.InventorytransferModify.emit(transfer);
                this.display = false;
                this.index=0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print(){
        this.printService.printRequestTransfer(this.transfer);
    }

}
