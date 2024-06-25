import { PrintEntryService } from './../services/print-entry.service';
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
import { InventoryEntryDetailModel } from './../models/inventory-entry-detail';
import { InventoryEntryModel } from './../models/inventory-entry';
import { InventoryEntryService } from './../services/inventory-entry.service';
import { ItemModel } from './../../../items/models/items';
import { ItemsBrowserComponent } from 'src/app/pages/browser/items/items-browser/items-browser.component';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { InventoryTypeService } from '../../inventory-transaction-type/services/inventory-type.service';
import { InventoryTransactionTypeModel } from '../../inventory-transaction-type/model/inventory-type-model';

@Component({
    selector: 'app-inventory-entry-dialog',
    templateUrl: './inventory-entry-dialog.component.html',
    styleUrls: ['./inventory-entry-dialog.component.scss'],
})
export class InventoryEntryDialogComponent implements OnInit {
    @Output() InventoryentryModify = new EventEmitter<InventoryEntryModel[]>();
    @ViewChild(ItemsBrowserComponent) ItemsBrowser: ItemsBrowserComponent;
    entry: InventoryEntryModel = new InventoryEntryModel();
    isAdd: boolean;
    disabled: boolean = false;
    formEntry: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    docQuantity: number = 0;
    wareHouseList: WareHouseModel[];
    typeEntryList: InventoryTransactionTypeModel[];
    index = 0;
    barcodeValue: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private entryService: InventoryEntryService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private printService: PrintEntryService,
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
                await this.typeService.getInventoryTransactionTypeBy('E');
            this.typeEntryList.unshift({
                id: 0,
                name: 'Seleccione el tipo de ingreso',
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

    showDialog(entryNew: InventoryEntryModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = !isAdd;
        this.entry = entryNew;
        this.docQuantity = entryNew.docQuantity;
        this.doctotal = entryNew.docTotal;
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        const currentTimeStamp = Date.now();
        const currentDate = new Date(currentTimeStamp);
        this.formEntry = this.formBuilder.group({
            entryId: [this.entry.entryId ?? 0],
            entryDate: [this.entry.entryDate ?? currentDate.toISOString().substring(0, 10)],
            comment: [this.entry.comment ?? 'Entrada de mercancia', Validators.required],
            docTotal: [this.entry.docTotal ?? 0],
            whsCode: [
                this.entry.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            type: [this.entry.type ?? 0, Validators.required],
            createBy: [this.entry.createBy ?? this.usuario.userId],
            detail: [[]],
        });
    }

    new() {
        this.entry = undefined;
        this.formEntry = undefined;
    }

    addLine(detail: InventoryEntryDetailModel[]) {
        detail.push(
            new InventoryEntryDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                entryDetailId: 0,
                entryId: 0,
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
        this.entry.detail = this.entry.detail.filter((x) => x.itemId != itemId);
        this.calculate();
        this.index--;
    }

    showDialogItem(index: number) {
        this.ItemsBrowser.index = index;
        this.ItemsBrowser.showDialog('ItemActive');
    }

    findBarcode(barcode: string) {
        this.ItemsBrowser.index = this.index;
        this.ItemsBrowser.findByBardCode(barcode, 'ItemActiveByBarcode');
        this.entry.detail.push(
            new InventoryEntryDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                entryDetailId: 0,
                entryId: 0,
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
        this.entry.detail.push(
            new InventoryEntryDetailModel({
                whsName: '',
                itemCode: '',
                itemName: '',
                entryDetailId: 0,
                entryId: 0,
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
        this.ItemsBrowser.index = this.entry.detail.length - 1;
        this.showDialogItem(this.entry.detail.length - 1);
    }

    browserItems(item: ItemModel) {
        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.entry.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.entry.detail.find((x) => x.itemId == item.itemId)
                    .quantity++;
                this.calculate();
            } else {
                this.entry.detail[currentIndex].itemId = item.itemId;
                this.entry.detail[currentIndex].itemCode = item.itemCode;
                this.entry.detail[currentIndex].itemName = item.itemName;
                this.entry.detail[currentIndex].unitOfMeasureId =
                    item.unitOfMeasureId;
                this.entry.detail[currentIndex].price = item.pricePurchase;
                let dueDateItem = new Date(); // fecha actual
                dueDateItem.setDate(dueDateItem.getDate() + 360);
                this.entry.detail[currentIndex].dueDate = dueDateItem;
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.entry.detail.filter((x) => x.itemId == 0);
        this.index = this.index - deleteIndex.length;
        this.entry.detail = this.entry.detail.filter((x) => x.itemId != 0);
        this.renderer.selectRootElement('#quantity').focus();
    }

    calculate() {
        setTimeout(() => {
            this.entry.detail.forEach(
                (x) => (x.lineTotal = x.quantity * x.price)
            );
            const total = this.entry.detail.reduce(
                (acumulador, producto) => acumulador + producto.lineTotal,
                0
            );
            const totalQty = this.entry.detail.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );
            this.doctotal = total;
            this.docQuantity = totalQty;
        }, 1000);
    }

    async add() {
        if (this.formEntry.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando ingreso de mercaderia'
                );

                let newEntry = this.formEntry.value as InventoryEntryModel;
                newEntry.detail = this.entry.detail;
                newEntry.detail.forEach((x) => (x.whsCode = newEntry.whsCode));
                newEntry.docTotal = this.doctotal;
                let entry = await this.entryService.add(newEntry);
                this.printService.printRequestEntry(entry[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.InventoryentryModify.emit(entry);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print() {
        this.printService.printRequestEntry(this.entry);
    }
}
