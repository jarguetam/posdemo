export class InventoryTransferDetailModel {
    itemCode: string;
    itemName: string;
    transferDetailId: number;
    transferId: number;
    itemId: number;
    quantity: number;
    quantityUnit: string;
    stock:number;
    price: number;
    dueDate: Date;
    lineTotal: number;
    fromWhsCode: number;
    fromWhsName: string;
    toWhsCode: number;
    toWhsName: string;
    unitOfMeasureId: number;
    unitOfMeasureName: string;

    constructor(data?: InventoryTransferDetailModel) {
        if (data != null) {
            this.itemCode = data.itemCode;
            this.itemName = data.itemName;
            this.transferDetailId = data.transferDetailId;
            this.transferId = data.transferId;
            this.itemId = data.itemId;
            this.quantity = data.quantity;
            this.price = data.price;
            this.dueDate = data.dueDate;
            this.lineTotal = data.lineTotal;
            this.fromWhsCode = data.fromWhsCode;
            this.fromWhsName = data.fromWhsName;
            this.toWhsCode = data.toWhsCode;
            this.toWhsName = data.toWhsName;
            this.unitOfMeasureId= data.unitOfMeasureId;
            this.unitOfMeasureName= data.unitOfMeasureName;
            return;
        }
        this.itemCode = this.itemCode;
        this.itemName = this.itemName;
        this.transferDetailId = this.transferDetailId;
        this.transferId = this.transferId;
        this.itemId = this.itemId;
        this.quantity = this.quantity;
        this.price = this.price;
        this.dueDate = this.dueDate;
        this.lineTotal = this.lineTotal;
        this.fromWhsCode = this.fromWhsCode;
        this.fromWhsName = this.fromWhsName;
        this.toWhsCode = this.toWhsCode;
        this.toWhsName = this.toWhsName;
        this.unitOfMeasureId = this.unitOfMeasureId;
        this.unitOfMeasureName = this.unitOfMeasureName;
    }
}
