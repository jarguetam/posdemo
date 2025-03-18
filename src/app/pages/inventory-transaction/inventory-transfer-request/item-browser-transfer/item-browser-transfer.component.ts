import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ItemBrowserModel } from '../models/item-browser';
import { InventoryTransferRequestService } from '../service/inventory-transfer-request.service';
import { Messages } from 'src/app/helpers/messages';
import { ItemWareHouse } from 'src/app/pages/items/models/item-warehouse';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-item-browser-transfer',
    templateUrl: './item-browser-transfer.component.html',
    styleUrls: ['./item-browser-transfer.component.scss'],
})
export class ItemBrowserTransferComponent implements OnInit {
    @Output() ItemSelect = new EventEmitter<ItemBrowserModel[]>();
    @ViewChild('dt') dt: Table;
    loading: boolean = false;
    display: boolean = false;
    itemList: ItemBrowserModel[] = [];
    categories: any[] = [];
    selectedCategory: any = null;
    filteredItems: any[] = [];
    originalItems: any[] = [];

    constructor(private service: InventoryTransferRequestService) {}

    ngOnInit(): void {}

    async showDialog(
        from: number,
        to: number,
        itemlistUser: ItemBrowserModel[]
    ) {
        console.log(itemlistUser);
        if (from === 0) {
            Messages.warning(
                'Advertencia',
                'Debe seleccionar el almacen origen.'
            );
            return;
        }
        this.display = true;
        this.itemList = await this.service.getItemsToTransfer(from, to);
        // Actualizar itemList con las cantidades de itemlistUser
        this.itemList = this.itemList.map((item) => {
            const result = itemlistUser.find((x) => x.itemId == item.itemId);
            return {
                ...item,
                cantidad:
                    result !== undefined ? result.cantidad : item.cantidad,
            };
        });
        this.originalItems = [...this.itemList];
        this.categories = [
            ...new Set(this.itemList.map((item) => item.itemCategoryName)),
        ].map((cat) => ({ name: cat }));
        this.service.itemList = this.itemList;
    }

    filterTable(event: any) {
        const filterValue = (event.target as HTMLInputElement)?.value || event.value.name;
        this.dt.filterGlobal(filterValue, 'contains');
    }
    onCantidadChange(item: ItemBrowserModel) {
        this.service.itemList.find((x) => x.itemId === item.itemId).cantidad =
            item.cantidad;
    }

    save() {
        this.service.itemList = this.itemList.filter((x) => x.cantidad != 0);
        this.display = false;
        this.ItemSelect.emit(this.service.itemList);
    }

    onCantidadFocus(item: ItemBrowserModel) {
        if (item.cantidad == 0) {
            item.cantidad = null;
        }
    }

    close() {
        this.display = false;
    }

    onCantidadBlur(item: ItemBrowserModel) {}

    filterByCategory() {
        if (!this.selectedCategory) {
            this.itemList = [...this.originalItems];
            return;
        }
        this.itemList = this.originalItems.filter(
            (item) => item.itemCategoryName === this.selectedCategory.name
        );
    }
}
