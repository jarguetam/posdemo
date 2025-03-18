import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemCategoryModel } from '../models/category-items';
import { ItemJornalModel } from '../models/item-jornal-model';
import { ItemWareHouse } from '../models/item-warehouse';
import { ItemModel } from '../models/items';
import { ItemSubCategoryModel } from '../models/sub-category-items';
import { UnitOfMeasureModel } from '../models/unit-of-measure';
import { DbLocalService } from 'src/app/service/db-local.service';
import { ConnectionStateService } from 'src/app/service/connection-state.service';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private http: HttpClient, private db: DbLocalService,private connectionStateService: ConnectionStateService) {}
    itemsListService: ItemWareHouse[];

    async getItemsCategory() {
        return await firstValueFrom(
            this.http.get<ItemCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/ItemCategory`
            )
        );
    }

    async getItemsCategoryActive() {
        return await firstValueFrom(
            this.http.get<ItemCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/ItemCategoryActive`
            )
        );
    }

    async addItemsCategory(request: ItemCategoryModel) {
        return await firstValueFrom(
            this.http.post<ItemCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/AddItemCategory`,
                request
            )
        );
    }

    async editItemsCategory(request: ItemCategoryModel) {
        return await firstValueFrom(
            this.http.put<ItemCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/EditItemCategory`,
                request
            )
        );
    }
    //SubCategory
    async getItemsSubCategory() {
        return await firstValueFrom(
            this.http.get<ItemSubCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/ItemSubCategory`
            )
        );
    }

    async getItemsSubCategoryActive() {
        return await firstValueFrom(
            this.http.get<ItemSubCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/ItemSubCategoryActive`
            )
        );
    }

    async addItemsSubCategory(request: ItemSubCategoryModel) {
        return await firstValueFrom(
            this.http.post<ItemSubCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/AddItemSubCategory`,
                request
            )
        );
    }

    async editItemsSubCategory(request: ItemSubCategoryModel) {
        return await firstValueFrom(
            this.http.put<ItemSubCategoryModel[]>(
                `${environment.uriLogistic}/api/Item/EditItemSubCategory`,
                request
            )
        );
    }

    async getUnitOfMeasure() {
        return await firstValueFrom(
            this.http.get<UnitOfMeasureModel[]>(
                `${environment.uriLogistic}/api/Item/UnitOfMeasure`
            )
        );
    }

    async getUnitOfMeasureActive() {
        return await firstValueFrom(
            this.http.get<UnitOfMeasureModel[]>(
                `${environment.uriLogistic}/api/Item/UnitOfMeasureActive`
            )
        );
    }

    async addUnitOfMeasure(request: UnitOfMeasureModel) {
        return await firstValueFrom(
            this.http.post<UnitOfMeasureModel[]>(
                `${environment.uriLogistic}/api/Item/AddUnitOfMeasure`,
                request
            )
        );
    }

    async editUnitOfMeasure(request: UnitOfMeasureModel) {
        return await firstValueFrom(
            this.http.put<UnitOfMeasureModel[]>(
                `${environment.uriLogistic}/api/Item/EditUnitOfMeasure`,
                request
            )
        );
    }

    //Items
    async getItems() {
        return await firstValueFrom(
            this.http.get<ItemModel[]>(
                `${environment.uriLogistic}/api/Item/Item`
            )
        );
    }

    async getItemsActive(type: String) {
        return await firstValueFrom(
            this.http.get<ItemModel[]>(
                `${environment.uriLogistic}/api/Item/${type}`
            )
        );
    }

    async getItemsActiveByBarcode(type: String, barcode: String) {
        return await firstValueFrom(
            this.http.get<ItemModel[]>(
                `${environment.uriLogistic}/api/Item/${type}${barcode}`
            )
        );
    }

    async getItemsWareHouse(whscode: number) {
        return await firstValueFrom(
            this.http.get<ItemWareHouse[]>(
                `${environment.uriLogistic}/api/Item/ItemStockWareHouse${whscode}`
            )
        );
    }

    async getItemsWareHouseBarcode(whscode: number, barcode: string) {
        return await firstValueFrom(
            this.http.get<ItemWareHouse[]>(
                `${environment.uriLogistic}/api/Item/ItemStockWareHouseBarcode${whscode}/${barcode}`
            )
        );
    }
    private async getOfflineInventoryWithPrices(
        customerId: number,
        priceListId: number
    ): Promise<ItemWareHouse[]> {
        const [inventory, specialPrices] = await Promise.all([
            this.db.inventory
                .where('listPriceId')
                .equals(priceListId)
                .toArray(),
            this.db.specialPrices
                .where('customerId')
                .equals(customerId)
                .toArray()
        ]);

        // Aplicar los precios especiales al inventario
        return inventory.map((item) => {
            const specialPrice = specialPrices.find(
                (sp) => sp.itemId === item.itemId
            );
            return {
                ...item,
                priceSales: specialPrice?.priceSpecial || item.priceSales,
            };
        });
    }

    async getItemsWareHousePrice(
        whsCode: number,
        customerId: number,
        priceListId: number
    ): Promise<ItemWareHouse[]> {
        // Si estamos en modo offline forzado o sin conexión, usar datos locales
        if (this.connectionStateService.isEffectivelyOffline()) {
            console.log('Using offline inventory data due to offline mode');
            return this.getOfflineInventoryWithPrices(customerId, priceListId);
        }

        try {
            const apiDataPromise = firstValueFrom(
                this.http
                    .get<ItemWareHouse[]>(
                        `${environment.uriLogistic}/api/Item/ItemStockWareHousePrice${whsCode}/${customerId}/${priceListId}`
                    )
                    .pipe(
                        catchError((error) => {
                            console.error('Error fetching inventory:', error);
                            return throwError(() => error);
                        }),
                        timeout(10000)
                    )
            );

            const inventory = await Promise.race([
                apiDataPromise,
                new Promise<ItemWareHouse[]>((resolve) =>
                    setTimeout(() => {
                        console.warn('API request timed out after 8 seconds');
                        resolve([]);
                    }, 8000)
                )
            ]);

            // Verificar si hay datos válidos
            if (!inventory || inventory.length === 0) {
                throw new Error('No inventory data received or timeout occurred');
            }

            return inventory;

        } catch (error) {
            console.warn('Fallback to offline inventory data due to error:', error);
            return this.getOfflineInventoryWithPrices(customerId, priceListId);
        }
    }

    async getItemsWareHousePriceBarCode(
        whsCode: number,
        customerId: number,
        priceListId: number,
        barcode: string
    ) {
        return await firstValueFrom(
            this.http.get<ItemWareHouse[]>(
                `${environment.uriLogistic}/api/Item/ItemStockWareHousePriceBarcode${whsCode}/${customerId}/${priceListId}/${barcode}`
            )
        );
    }

    async addItems(request: ItemModel) {
        return await firstValueFrom(
            this.http.post<ItemModel[]>(
                `${environment.uriLogistic}/api/Item/AddItem`,
                request
            )
        );
    }

    async editItems(request: ItemModel) {
        return await firstValueFrom(
            this.http.put<ItemModel[]>(
                `${environment.uriLogistic}/api/Item/EditItem`,
                request
            )
        );
    }

    async getItemsJornal(
        itemId: number,
        from: string,
        to: string,
        whsCode: number
    ) {
        return await firstValueFrom(
            this.http.get<ItemJornalModel[]>(
                `${environment.uriLogistic}/api/ItemJournal/GetItemJornal${itemId}/${from}/${to}/${whsCode}`
            )
        );
    }
}
