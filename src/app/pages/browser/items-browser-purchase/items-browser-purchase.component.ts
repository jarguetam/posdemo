import { Component, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ItemWareHouse } from '../../items/models/item-warehouse';
import { Table } from 'primeng/table';
import { CompanyInfo } from 'src/app/models/company-info';
import { ItemService } from '../../items/service/items.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentDetailModel } from '../../purchase/models/document-detail';
import { Messages } from 'src/app/helpers/messages';

@Component({
  selector: 'app-items-browser-purchase',
  templateUrl: './items-browser-purchase.component.html',
  styleUrls: ['./items-browser-purchase.component.scss']
})
export class ItemsBrowserPurchaseComponent implements OnInit {
@Output() ItemSelect = new EventEmitter<ItemWareHouse>();
    @ViewChild('dt') dt: Table;
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;
    firstMatchingItem: any;
    isMobile: boolean;
    company: CompanyInfo;
    categories: any[] = [];
    selectedCategory: any = null;
    filteredItems: any[] = [];
    originalItems: any[] = [];

    constructor(
        private itemServices: ItemService,
        private auth: AuthService,
        private renderer: Renderer2
    ) {
        this.isMobile = this.detectMobile();
        this.company = this.auth.CompanyValue;
    }
    items: ItemWareHouse[];
    item: ItemWareHouse = new ItemWareHouse();

    ngOnInit(): void {}

    filterTable(event: any) {
        let filterValue: string;

        if (event.target) {
            // Caso del input text
            filterValue = (event.target as HTMLInputElement).value;
        } else if (event.value) {
            // Caso cuando se selecciona un item del dropdown
            filterValue = event.value.name;
        } else {
            // Caso cuando se limpia la selección
            filterValue = '';
        }

        console.log(filterValue);
        this.dt.filterGlobal(filterValue, 'contains');
    }

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    }

    async _get(
        whscode: number,
        customerId: number,
        priceListId: number,
        itemlistUser: DocumentDetailModel[]
    ) {
        try {
            this.loading = true;

            // Obtener los items del servicio
            let items = await this.itemServices.getItemsWareHousePrice(
                whscode,
                customerId,
                priceListId
            )|| [];

            // Crear un Set para almacenar los itemId únicos
            const uniqueItemIds = new Set<number>();

            // Filtrar los items para evitar duplicados
            this.items = items.filter((item) => {
                if (uniqueItemIds.has(item.itemId)) {
                    return false; // Si el itemId ya está en el Set, no lo incluyas
                }
                uniqueItemIds.add(item.itemId); // Agrega el itemId al Set
                return true;
            }).map((item) => {
                const result = itemlistUser.find(
                    (x) => x.itemId == item.itemId
                );
                return {
                    ...item,
                    quantity:
                        result !== undefined ? result.quantity : item.quantity,
                };
            });

            this.itemServices.itemsListService = this.items;
            this.originalItems = [...this.items];
            this.categories = [
                ...new Set(this.items.map((item) => item.itemCategoryName)),
            ].map((cat) => ({ name: cat }));

            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    filterByCategory() {
        // Mantener todos los items modificados en el servicio
        this.items = !this.selectedCategory
            ? [...this.originalItems]
            : this.originalItems.filter(item => item.itemCategoryName === this.selectedCategory.name);

        // Sincronizar cantidades con itemsListService
        this.items.forEach(item => {
            const serviceItem = this.itemServices.itemsListService.find(x => x.itemId === item.itemId);
            if (serviceItem) {
                item.quantity = serviceItem.quantity;
            }
        });
    }

    showDialog(
        whsCode: number,
        customerId: number,
        priceListId: number,
        itemlistUser: DocumentDetailModel[]
    ) {
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

        this._get(whsCode, customerId, priceListId, itemlistUser);
        this.display = true;
        if (!this.isMobile) {
            setTimeout(
                () => this.renderer.selectRootElement('#searchItem').focus(),
                500
            );
        }
    }

    close() {
        this.display = false;
    }

    selectItem(c: ItemWareHouse) {
        this.item = c;
        if (c.stock === 0 && this.company.negativeInventory == false) {
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

    onCantidadChange(item: ItemWareHouse) {
        // Actualizar en el servicio
        const serviceItem = this.itemServices.itemsListService.find(x => x.itemId === item.itemId);
        if (serviceItem) {
            serviceItem.quantity = item.quantity;
        } else {
            this.itemServices.itemsListService.push({...item});
        }
    }

    save() {
        const itemsToSave = this.items.filter(x => x.quantity != 0 && x.quantity != null);
        this.itemServices.itemsListService = itemsToSave;
        this.display = false;
        itemsToSave.forEach(item => this.ItemSelect.emit(item));
    }

    onCantidadFocus(item: ItemWareHouse) {
        if (item.quantity == 0) {
            item.quantity = null;
        }
    }

    async findByBardCode(
        whscode: number,
        customerId: number,
        priceListId: number,
        barcode: string
    ) {
        try {
            this.loading = true;
            this.items = await this.itemServices.getItemsWareHousePriceBarCode(
                whscode,
                customerId,
                priceListId,
                barcode
            );
            if (this.items.length == 0) {
                Messages.warning(
                    'Advertencia',
                    'No se encontro ningun articulo...'
                );
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
