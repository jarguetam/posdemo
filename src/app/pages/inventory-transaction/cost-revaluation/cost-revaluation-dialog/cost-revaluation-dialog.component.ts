import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CostRevaluationModel } from '../models/cost-revaluation-model';
import { CostRevaluationService } from '../services/cost-revaluation.service';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ItemsBrowserWareHouseComponent } from 'src/app/pages/browser/items/items-browser-ware-house/items-browser-ware-house.component';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';


@Component({
    selector: 'app-cost-revaluation-dialog',
    templateUrl: './cost-revaluation-dialog.component.html',
    styleUrls: ['./cost-revaluation-dialog.component.scss'],
})
export class CostRevaluationDialogComponent implements OnInit {
    @Output() CostRevaluationModify = new EventEmitter<
        CostRevaluationModel[]
    >();
    @ViewChild(ItemsBrowserWareHouseComponent)
    ItemsBrowser: ItemsBrowserWareHouseComponent;
    costRevaluation: CostRevaluationModel = new CostRevaluationModel();
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

    constructor(
        private formBuilder: FormBuilder,
        private costRevaluationService: CostRevaluationService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService //private printService: PrintOupPutService,
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
    }

    showDialog(costRevaluationNew: CostRevaluationModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = !isAdd;
        this.costRevaluation = costRevaluationNew;
        this.costRevaluation.detail = [];
        if(!isAdd){
            this.costRevaluation.detail.push(costRevaluationNew);
        }
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        this.formOutPut = this.formBuilder.group({
            costRevaluationId: [this.costRevaluation.id ?? 0],
            itemId: [this.costRevaluation.itemId ?? 0, Validators.required],
            previousCost: [
                this.costRevaluation.previousCost ?? 0,
                Validators.required,
            ],
            newCost: [this.costRevaluation.newCost ?? 0, Validators.required],
            createBy: [this.costRevaluation.createBy ?? this.usuario.userId],
            comment: [
                this.costRevaluation.comment ?? 'Revalorizacion de inventario',
                Validators.required,
            ],
            whsCode: [
                this.costRevaluation.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
        });
    }

    new() {
        this.costRevaluation = undefined;
        this.formOutPut = undefined;
    }

    addLine(detail: CostRevaluationModel[]) {
        detail.push(
            new CostRevaluationModel({
                id: 0,
                itemId: 0,
                previousCost: 0,
                newCost: 0,
                createDate: undefined,
                createBy: 0,
                comment: '',
                whsCode: 0,
                itemCode: '',
                itemName: '',
                whsName: '',
                createByName: '',
                detail: []
            })
        );
        this.showDialogItem(this.index);
        this.index++;
    }

    deleteLine(itemId: number) {
        this.costRevaluation.detail = this.costRevaluation.detail.filter(
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
        this.costRevaluation.detail.push(new CostRevaluationModel({ id: 0,
            itemId: 0,
            previousCost: 0,
            newCost: 0,
            createDate: undefined,
            createBy: 0,
            comment: '',
            whsCode: 0,
            itemCode: '',
            itemName: '',
            whsName: '',
            createByName: '',
            detail: []}));
        this.index++;
    }

    browserItems(item: ItemWareHouse) {
        if (this.ItemsBrowser.index != -1) {
            let currentIndex = this.ItemsBrowser.index;
            let itemFind = this.costRevaluation.detail.find(
                (x) => x.itemId == item.itemId
            );
            if (itemFind) {
                this.calculate();
            } else {
                this.costRevaluation.detail[currentIndex].itemId = item.itemId;
                this.costRevaluation.detail[currentIndex].itemCode =
                    item.itemCode;
                this.costRevaluation.detail[currentIndex].itemName =
                    item.itemName;
                this.costRevaluation.detail[currentIndex].previousCost = item.avgPrice;
                this.costRevaluation.detail[currentIndex].newCost =0;
            }
        }
        this.ItemsBrowser.index = -1;
        let deleteIndex = this.costRevaluation.detail.filter(
            (x) => x.itemId == 0
        );
        this.index = this.index - deleteIndex.length;
        this.costRevaluation.detail = this.costRevaluation.detail.filter(
            (x) => x.itemId != 0
        );
    }

    calculate() {
        setTimeout(() => {
            const total = this.costRevaluation.detail.reduce(
                (acumulador, producto) => acumulador + producto.previousCost,
                0
            );
            const totalQty = this.costRevaluation.detail.reduce(
                (acc, item) => acc + Number(item.newCost),
                0
            );
            this.doctotal = total;
            this.docQuantity = totalQty;
        }, 1000);
    }

    async add() {
        if (this.formOutPut.valid) {
            try {
                Messages.loading('Agregando', 'Agregando revalorizacion');
                let newOutPut = this.formOutPut.value as CostRevaluationModel;
                newOutPut.detail = this.costRevaluation.detail;
                newOutPut.detail.forEach(
                    (x) => (x.whsCode = newOutPut.whsCode, x.comment = newOutPut.comment, x.createBy = this.usuario.userId,
                        x.comment = newOutPut.comment)
                );
                let costRevaluation = await this.costRevaluationService.add(
                    newOutPut.detail
                );
                //this.printService.printRequestOutPut(costRevaluation[0]);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.CostRevaluationModify.emit(costRevaluation);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    print() {
       // this.printService.printRequestOutPut(this.costRevaluation);
    }
}
