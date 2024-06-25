import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { ItemJornalModel } from '../models/item-jornal-model';
import { ItemService } from '../service/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WareHouseModel } from '../warehouse/models/warehouse';
import { ServiceWareHouseService } from '../warehouse/service/service-ware-house.service';

@Component({
    selector: 'app-view-jornal-items-dialog',
    templateUrl: './view-jornal-items-dialog.component.html',
    styleUrls: ['./view-jornal-items-dialog.component.scss'],
})
export class ViewJornalItemsDialogComponent implements OnInit {
    loading: boolean;
    jornalList: ItemJornalModel[];
    display: boolean;
    formFilter: FormGroup;
    itemId: number;
    wareHouseList: WareHouseModel[];
    constructor(
        private commonService: ItemService,
        private formBuilder: FormBuilder,
        private wareHouseService: ServiceWareHouseService,
    ) {}

    ngOnInit(): void {
        this._createFormBuild();
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            to: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            whsCode: [0]
        });
    }

    async _getData() {
        try {
            this.loading = true;
            this.jornalList = await this.commonService.getItemsJornal(
                this.itemId,
                this.formFilter.value.from,
                this.formFilter.value.to,
                this.formFilter.value.whsCode,
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async showDialog(itemId: number) {
        //   this._getData(itemId);
        this.itemId = itemId;
        this.display = true;

        this.wareHouseList = await this.wareHouseService.getWarehouseActive();

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
    }
}
