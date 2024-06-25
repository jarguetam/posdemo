import { ItemModel } from './../../../items/models/items';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { ItemService } from 'src/app/pages/items/service/items.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-items-browser',
    templateUrl: './items-browser.component.html',
    styleUrls: ['./items-browser.component.scss'],
})
export class ItemsBrowserComponent implements OnInit {
    @Output() ItemSelect = new EventEmitter<ItemModel>();
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;

    constructor(private itemServices: ItemService, private renderer: Renderer2) {}
    items: ItemModel[];
    item: ItemModel = new ItemModel();

    ngOnInit(): void {
      //  this._get();
    }

    async _get(type: String) {
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsActive(type);
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(type: String) {
        this._get(type);
        this.display = true;
            setTimeout(
                () => this.renderer.selectRootElement('#searchItem').focus(),
                500
            );

    }

    selectItem(c: ItemModel) {
        this.item = c;
        this.ItemSelect.emit(this.item);
        this.display = false;
        this.item = new ItemModel();
    }

    async findByBardCode(barcode: String,type: String){
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsActiveByBarcode(type, barcode);
            if(this.items.length==0){
                Messages.warning("Advertencia", "No se encontro ningun articulo...")
                return;
            }
            this.ItemSelect.emit(this.items[0]);
            this.item = new ItemModel();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }
}
