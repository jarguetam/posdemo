export class InventoryReturnDetailModel {
    idDetail:          number;
    idReturn:          number;
    itemId:            number;
    itemCode:          string;
    itemName:          string;
    quantityInitial:          number;
    quantityWareHouse:    number;
    quantitySeller: number;
    quantityOutPut: number;
    quantityReturn: number;
    quantityDiference: number;
    comment: string;
    itemCategoryName: string;

    constructor(data?: Partial<InventoryReturnDetailModel>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
