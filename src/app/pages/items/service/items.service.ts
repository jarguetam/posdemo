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

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private http: HttpClient, private db: DbLocalService) {}

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
                `${environment.uriLogistic}/api/Item/EditItemCategory`,
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

    async getItemsWareHousePrice(
        whsCode: number,
        customerId: number,
        priceListId: number
    ) {
        try {
            const apiDataPromise = firstValueFrom(
                this.http.get<ItemWareHouse[]>(`${environment.uriLogistic}/api/Item/ItemStockWareHousePrice${whsCode}/${customerId}/${priceListId}`).pipe(
                    catchError((error) => throwError(() => error)),
                    timeout(2000) // Espera máximo 5 segundos para la respuesta de la API
                )
            );
            const inventory = await Promise.race([
                apiDataPromise,
                new Promise(resolve => setTimeout(resolve, 2000))
            ]) as ItemWareHouse[];
            return inventory;
        } catch (error) {
            const data = await this.db.inventory.where('listPriceId').equals(priceListId).toArray();
            return data;
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

    async getItemsJornal(itemId: number) {
        return await firstValueFrom(
            this.http.get<ItemJornalModel[]>(
                `${environment.uriLogistic}/api/ItemJournal/GetItemJornal${itemId}`
            )
        );
    }
}
