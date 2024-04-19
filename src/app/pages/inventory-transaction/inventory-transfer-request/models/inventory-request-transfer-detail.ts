export class InventoryRequestTransferDetail {
    itemCode: string;
    itemName: string;
    transferRequestDetailId: number;
    transferRequestId: number;
    itemId: number;
    quantity: number;
    price: number;
    dueDate: Date;
    lineTotal: number;
    fromWhsCode: number;
    fromWhsName: string;
    toWhsCode: number;
    toWhsName: string;
    unitOfMeasureId: number;
    unitOfMeasureName: string;

    constructor(data?: InventoryRequestTransferDetail) {
        if (data != null) {
            this.itemCode = data.itemCode;
            this.itemName = data.itemName;
            this.transferRequestDetailId = data.transferRequestDetailId;
            this.transferRequestId = data.transferRequestId;
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
        this.transferRequestDetailId = this.transferRequestDetailId;
        this.transferRequestId = this.transferRequestId;
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
