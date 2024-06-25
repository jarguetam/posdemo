import { Component, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Messages } from 'src/app/helpers/messages';
import { CompanyInfo } from 'src/app/models/company-info';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { ItemService } from 'src/app/pages/items/service/items.service';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
  selector: 'app-items-browser-price-sales',
  templateUrl: './items-browser-price-sales.component.html',
  styleUrls: ['./items-browser-price-sales.component.scss']
})
export class ItemsBrowserPriceSalesComponent implements OnInit {
    @Output() ItemSelect = new EventEmitter<ItemWareHouse>();
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;
    firstMatchingItem: any;
    isMobile: boolean;
    company: CompanyInfo;

    constructor(private itemServices: ItemService,  private auth: AuthService,private renderer: Renderer2) {
        this.isMobile = this.detectMobile();
        this.company = this.auth.CompanyValue;
    }
    items: ItemWareHouse[];
    item: ItemWareHouse = new ItemWareHouse();

    ngOnInit(): void {}

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    }

    async _get(whscode: number, customerId: number, priceListId: number) {
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsWareHousePrice(whscode, customerId, priceListId);
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(whsCode: number, customerId: number, priceListId: number) {
        if (whsCode === 0) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar el almacen primero.'
            );
            return;
        }

        if (customerId === undefined) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar el cliente primero.'
            );
            return;
        }
        if (priceListId === undefined) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar el cliente primero.'
            );
            return;
        }

        this._get(whsCode, customerId, priceListId);
        this.display = true;
        if(!this.isMobile){
            setTimeout(
                () => this.renderer.selectRootElement('#searchItem').focus(),
                500
            );
        }
    }

    selectItem(c: ItemWareHouse) {
        this.item = c;
        if (c.stock === 0 && this.company.negativeInventory==false) {
            Messages.warning(
                'Advertencia',
                'Este articulo no tiene inventario.'
            );
            return;
        }
        if (c.priceSales === 0) {
            Messages.warning(
                'Advertencia',
                'Este articulo no tiene precio de venta. Favor asignar.'
            );
            return;
        }
        this.ItemSelect.emit(this.item);
        this.display = false;
        this.item = new ItemWareHouse();
    }

    async findByBardCode(whscode: number, customerId: number, priceListId: number,barcode: string){
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsWareHousePriceBarCode(whscode, customerId, priceListId, barcode);
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

    selectItemEnter(item: any) {
        if (this.firstMatchingItem) {
            this.selectItem(this.firstMatchingItem);
          }

      }

}
