import { ItemWareHouse } from "./item-warehouse";

export class ItemModel {
    itemId: number;
    itemCode: string;
    itemName: string;
    itemCategoryId: number;
    itemCategoryName: string;
    itemFamilyId: number;
    itemFamilyName: string;
    unitOfMeasureId: number;
    unitOfMeasureName: string;
    stock: number;
    avgPrice: number;
    pricePurchase: number;
    salesItem: true;
    purchaseItem: true;
    inventoryItem: true;
    tax: true;
    weight: number;
    barCode: string;
    createBy: number;
    createByName: string;
    createDate: Date;
    updateBy: number;
    updateDate: Date;
    active: true;
    itemWareHouse: ItemWareHouse[];
    name: string;
    lastName: string;
}
