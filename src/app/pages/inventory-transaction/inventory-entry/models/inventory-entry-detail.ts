export class InventoryEntryDetailModel {
    whsName: string;
    itemCode: string;
    itemName: string;
    entryDetailId: number;
    entryId: number;
    itemId: number;
    quantity: number;
    price: number;
    dueDate: Date;
    lineTotal: number;
    whsCode: number;
    unitOfMeasureId: number;
    unitOfMeasureName: string;

    constructor(data?: InventoryEntryDetailModel) {
        if (data != null) {
            this.whsName = data.whsName;
            this.itemCode = data.itemCode;
            this.itemName = data.itemName;
            this.entryDetailId = data.entryDetailId;
            this.entryId = data.entryId;
            this.itemId = data.itemId;
            this.quantity = data.quantity;
            this.price = data.price;
            this.dueDate = data.dueDate;
            this.lineTotal = data.lineTotal;
            this.whsCode = data.whsCode;
            this.unitOfMeasureId= data.unitOfMeasureId;
            this.unitOfMeasureName= data.unitOfMeasureName;
            return;
        }
        this.whsName = this.whsName;
        this.itemCode = this.itemCode;
        this.itemName = this.itemName;
        this.entryDetailId = this.entryDetailId;
        this.entryId = this.entryId;
        this.itemId = this.itemId;
        this.quantity = this.quantity;
        this.price = this.price;
        this.dueDate = this.dueDate;
        this.lineTotal = this.lineTotal;
        this.whsCode = this.whsCode;
        this.unitOfMeasureId = this.unitOfMeasureId;
        this.unitOfMeasureName = this.unitOfMeasureName;
    }
}
