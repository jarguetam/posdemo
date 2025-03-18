import { ItemWareHouse } from './../../../items/models/item-warehouse';
import { AuthService } from 'src/app/service/users/auth.service';
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
import { InventoryOutPutDetailModel } from '../models/inventory-output-detail';
import { InventoryOutPutModel } from '../models/inventory-output';
import { InventoryOutPutService } from '../services/inventory-out-put.service';
import { ItemModel } from 'src/app/pages/items/models/items';
import { ItemsBrowserWareHouseComponent } from 'src/app/pages/browser/items/items-browser-ware-house/items-browser-ware-house.component';
import { Messages } from 'src/app/helpers/messages';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { PrintOupPutService } from '../services/print-oup-put.service';
import { InventoryTransactionTypeModel } from '../../inventory-transaction-type/model/inventory-type-model';
import { InventoryTypeService } from '../../inventory-transaction-type/services/inventory-type.service';

@Component({
    selector: 'app-inventory-out-put-dialog',
    templateUrl: './inventory-out-put-dialog.component.html',
    styleUrls: ['./inventory-out-put-dialog.component.scss'],
})
export class InventoryOutPutDialogComponent implements OnInit {
    @Output() InventoryoutPutModify = new EventEmitter<
        InventoryOutPutModel[]
    >();
    @ViewChild(ItemsBrowserWareHouseComponent)
    ItemsBrowser: ItemsBrowserWareHouseComponent;
    outPut: InventoryOutPutModel = new InventoryOutPutModel();
    isAdd: boolean;
    disabled: boolean = false;
    formOutPut: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    docQuantity: number = 0;
    wareHouseList: WareHouseModel[];
    index = 0;
    barcodeValue: string = '';
    typeEntryList: InventoryTransactionTypeModel[];

    constructor(
        private formBuilder: FormBuilder,
        private outPutService: InventoryOutPutService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintOupPutService,
        private typeService: InventoryTypeService,
        private renderer: Renderer2
    ) {
        this.usuario = this.authService.UserValue;
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
        try {
            this.loading = true;
            this.typeEntryList =
                await this.typeService.getInventoryTransactionTypeBy('S');
            this.typeEntryList.unshift({
                id: 0,
                name: 'Seleccione el tipo de salida',
                transaction: '',
                createBy: 0,
                createByName: '',
                createDate: undefined
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(outPutNew: InventoryOutPutModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = !isAdd;
        this.outPut = outPutNew;
        this.docQuantity = outPutNew.docQuantity;
        this.doctotal = outPutNew.docTotal;
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        this.formOutPut = this.formBuilder.group({
            outPutId: [this.outPut.outputId ?? 0],
            outputDate: [this.outPut.outputDate ?? new Date()],
            comment: [this.outPut.comment ?? 'Salida de mercancia', Validators.required],
            docTotal: [this.outPut.docTotal ?? 0],
            whsCode: [
                this.outPut.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            type: [this.outPut.type ?? 0, Validators.required],
            createBy: [this.outPut.createBy ?? this.usuario.userId],
            detail: [[]],
        });
    }

    new() {
        this.outPut = undefined;
        this.formOutPut = undefined;
    }

    addLine(detail: InventoryOutPutDetailModel[]) {
        detail.push(
            new InventoryOutPutDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                outPutDetailId: 0,
                outPutId: 0,
                itemId: 0,
                quantity: 0,
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
            })
        );
        this.showDialogItem(this.index);
        this.index++;
    }

    deleteLine(itemId: number) {
        this.outPut.detail = this.outPut.detail.filter(
            (x) => x.itemId != itemId
        );
        this.calculate();
        this.index--;
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog(this.formOutPut.get('whsCode').value, true);
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.index = this.index;
        this.ItemsBrowser.findByBardCode(
            this.formOutPut.get('whsCode').value,
            barcode
        );
        this.outPut.detail.push(
            new InventoryOutPutDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                outPutDetailId: 0,
                outPutId: 0,
                itemId: 0,
                quantity: 0,
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
            })
        );
        this.index++;
    }

    @HostListener('document:keydown.F2', ['$event']) onF2Keydown(
        event: KeyboardEvent
    ) {
        this.outPut.detail.push(
            new InventoryOutPutDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                outPutDetailId: 0,
                outPutId: 0,
                itemId: 0,
                quantity: 0,
                price: 0,
                dueDate: undefined,
                lineTotal: 0,
                whsCode: 0,
                unitOfMeasureId: 0,
                unitOfMeasureName: '',
            })
        );
        this.ItemsBrowser.index = this.outPut.detail.length - 1;
        this.showDialogItem(this.outPut.detail.length - 1);
    }

    browserItems(item: ItemWareHouse) {
        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.outPut.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.outPut.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                    this.calculate();
            } else {
                this.outPut.detail[currentIndex].itemId = item.itemId;
                this.outPut.detail[currentIndex].itemCode = item.itemCode;
                this.outPut.detail[currentIndex].itemName = item.itemName;
                this.outPut.detail[currentIndex].price = item.avgPrice;
                this.outPut.detail[currentIndex].dueDate = item.dueDate;
                this.outPut.detail[currentIndex].unitOfMeasureId =
                    item.unitOfMeasureId;
            }

        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.outPut.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.outPut.detail = this.outPut.detail.filter((x) => x.itemId != 0);
        this.renderer.selectRootElement('#quantity').focus();
    }

    calculate() {
        setTimeout(() => {
            this.outPut.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            const total = this.outPut.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.outPut.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.doctotal = total;
            this.docQuantity = totalQty;
        }, 1000);
    }

    async add() {
        if (this.formOutPut.valid) {
            try {
                Messages.loading('Agregando', 'Agregando salida de mercaderia');

                let newOutPut = this.formOutPut.value as InventoryOutPutModel;
                if (newOutPut.outputDate) {
                    const date = new Date(newOutPut.outputDate);
                    const offset = date.getTimezoneOffset();
                    newOutPut.outputDate = new Date(date.getTime() - (offset * 60 * 1000));
                }
                newOutPut.detail = this.outPut.detail;
                newOutPut.detail.forEach(
                    (x) => (x.whsCode = newOutPut.whsCode)
                );
                newOutPut.docTotal = this.doctotal;
                let outPut = await this.outPutService.add(newOutPut);
                this.printService.printRequestOutPut(outPut[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.InventoryoutPutModify.emit(outPut);
                this.display = false;
                this.index=0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print() {
        this.printService.printRequestOutPut(this.outPut);
    }
}
