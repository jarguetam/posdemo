export class InventoryOutPutDetailModel {
    whsName: string;
    itemCode: string;
    itemName: string;
    outPutDetailId: number;
    outPutId: number;
    itemId: number;
    quantity: number;
    price: number;
    dueDate: Date;
    lineTotal: number;
    whsCode: number;
    unitOfMeasureId: number;
    unitOfMeasureName: string;

    constructor(data?: InventoryOutPutDetailModel) {
        if (data != null) {
            this.whsName = data.whsName;
            this.itemCode = data.itemCode;
            this.itemName = data.itemName;
            this.outPutDetailId = data.outPutDetailId;
            this.outPutId = data.outPutId;
            this.itemId = data.itemId;
            this.quantity = data.quantity;
            this.price = data.price;
            this.dueDate = data.dueDate;
            this.lineTotal = data.lineTotal;
            this.whsCode = data.whsCode;
            this.unitOfMeasureId = data.unitOfMeasureId;
            this.unitOfMeasureName = data.unitOfMeasureName;
            return;
        }
        this.whsName = this.whsName;
        this.itemCode = this.itemCode;
        this.itemName = this.itemName;
        this.outPutDetailId = this.outPutDetailId;
        this.outPutId = this.outPutId;
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
