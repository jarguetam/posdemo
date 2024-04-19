import { ItemWareHouse } from './../../../items/models/item-warehouse';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { ItemService } from 'src/app/pages/items/service/items.service';

@Component({
    selector: 'app-items-browser-ware-house',
    templateUrl: './items-browser-ware-house.component.html',
    styleUrls: ['./items-browser-ware-house.component.scss'],
})
export class ItemsBrowserWareHouseComponent implements OnInit {
    @Output() ItemSelect = new EventEmitter<ItemWareHouse>();
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;
    validateStock: boolean = false;
    constructor(private itemServices: ItemService, private renderer: Renderer2) {}
    items: ItemWareHouse[];
    item: ItemWareHouse = new ItemWareHouse();

    ngOnInit(): void {}

    // ngAfterViewChecked(){
    //     setTimeout(
    //         (_) => this.renderer.selectRootElement('#search').focus(),
    //         0
    //     );
    // }

    async _get(whscode: number) {
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsWareHouse(whscode);
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(whsCode: number, validateStock: boolean) {
        if (whsCode === 0) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar el almacen primero.'
            );
            return;
        }
        this.validateStock = validateStock;
        this._get(whsCode);
        this.display = true;
    }

    selectItem(c: ItemWareHouse) {
        this.item = c;
        if (c.stock === 0 && this.validateStock) {
            Messages.warning(
                'Advertencia',
                'Este articulo no tiene inventario.'
            );
            return;
        }
        this.ItemSelect.emit(this.item);
        this.display = false;
        this.item = new ItemWareHouse();
    }

    async findByBardCode(whsCode: number,barcode: string){
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsWareHouseBarcode(whsCode, barcode);
            if(this.items.length==0){
                Messages.warning("Advertencia", "No se encontro ningun articulo...")
                return;
            }
            this.ItemSelect.emit(this.items[0]);
            this.item = new ItemWareHouse();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }
}
