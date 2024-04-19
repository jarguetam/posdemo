import { AuthService } from 'src/app/service/users/auth.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemModel } from '../../models/items';
import { ItemService } from '../../service/items.service';
import { User } from 'src/app/models/user';
import { Messages } from 'src/app/helpers/messages';
import { ItemCategoryModel } from '../../models/category-items';
import { UnitOfMeasureModel } from '../../models/unit-of-measure';
import { ViewJornalItemsDialogComponent } from '../../view-jornal-items-dialog/view-jornal-items-dialog.component';
import { ItemSubCategoryModel } from '../../models/sub-category-items';
import { BarcodeService } from '../../service/barcode-service.service';


@Component({
    selector: 'app-items-dialog',
    templateUrl: './items-dialog.component.html',
    styleUrls: ['./items-dialog.component.scss'],
})
export class ItemsDialogComponent implements OnInit {
    @Output() ItemModify = new EventEmitter<ItemModel[]>();
    @ViewChild(ViewJornalItemsDialogComponent)
    ViewJornalDialog: ViewJornalItemsDialogComponent;
    item: ItemModel;
    isAdd: boolean;
    formItem: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    itemsCategoryList: ItemCategoryModel[];
    unitOfMeasureList: UnitOfMeasureModel[];
    itemsSubCategoryList: ItemSubCategoryModel[];

    constructor(
        private fb: FormBuilder,
        private itemService: ItemService,
        private authService: AuthService,
        private barCode: BarcodeService,
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
    }
    async _getData() {
        try {
            this.loading = true;
            this.unitOfMeasureList = await this.itemService.getUnitOfMeasure();
            this.unitOfMeasureList.unshift({
                unitOfMeasureId: 0,
                unitOfMeasureName: 'Seleccione la unidad de medida',
                createBy: 0,
                createByName: '',
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
        try {
            this.loading = true;
            this.itemsCategoryList = await this.itemService.getItemsCategory();
            this.itemsCategoryList.unshift({
                itemCategoryId: 0,
                itemCategoryName: 'Seleccione la categoria',
                createBy: 0,
                createByName: '',
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
        try {
            this.loading = true;
            this.itemsSubCategoryList = await this.itemService.getItemsSubCategoryActive();
            this.itemsSubCategoryList.unshift({
                itemFamilyId: 0,
                itemFamilyName: 'Seleccione la sub categoria',
                createBy: 0,
                createByName: '',
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

    showDialog(item: ItemModel, isAdd: boolean) {
        this.new();
        this._getData();
        this.isAdd = isAdd;
        this.item = item;
        this._createFormBuild();
        this.display = true;
    }

    showBpJornal() {
        if (!this.authService.hasPermission('btn_history')) {
            Messages.warning(
                'No tiene acceso',
                'No puede ver historial de transacciones, por favor solicite el acceso.'
            );
            return;
        }
        this.ViewJornalDialog.showDialog(this.item.itemId);
    }

    _createFormBuild() {
        this.formItem = this.fb.group({
            itemId: [this.item.itemId ?? 0],
            itemCode: [this.item.itemCode ?? ''],
            itemName: [this.item.itemName ?? '', Validators.required],
            itemCategoryId: [
                this.item.itemCategoryId ?? 0,
                Validators.required,
            ],
            itemFamilyId: [
                this.item.itemFamilyId ?? 0,
                Validators.required,
            ],
            unitOfMeasureId: [
                this.item.unitOfMeasureId ?? 0,
                Validators.required,
            ],
            salesItem: [this.item.salesItem ?? true, Validators.required],
            purchaseItem: [this.item.purchaseItem ?? true, Validators.required],
            inventoryItem: [
                this.item.inventoryItem ?? true,
                Validators.required,
            ],
            pricePurchase: [this.item.pricePurchase ?? 0, Validators.required],
            tax: [this.item.tax ?? true, Validators.required],
            weight: [this.item.weight ?? 1, Validators.required],
            barCode: [this.item.barCode ?? ''],
            createBy: [this.item.createBy ?? this.usuario.userId],
            active: [this.item.active ?? false],
        });
    }

    new() {
        this.item = undefined;
        this.formItem = undefined;
    }

    async add() {
        if (this.formItem.valid) {
            try {
                Messages.loading('Agregando', 'Agregando articulo');
                let request = this.formItem.value as ItemModel;
                let region = await this.itemService.addItems(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.ItemModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formItem.valid) {
            try {
                Messages.loading('Editando', 'Editando articulo');
                let request = this.formItem.value as ItemModel;
                let users = await this.itemService.editItems(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.ItemModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    printBarcodes(){
        const codesPerPage = 12;
        this.barCode.generateBarcode(this.item.barCode, codesPerPage);
    }
}
