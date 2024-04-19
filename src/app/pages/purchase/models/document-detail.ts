export class DocumentDetailModel{
    docDetailId: number;
    docId: number;
    itemId: number;
    quantity: number;
    price: number;
    stock: number;
    dueDate: Date;
    lineTotal: number;
    taxValue: number;
    whsCode: number;
    unitOfMeasureId: number;
    isDelete: boolean;
    itemCode:string;
    itemName:string;
    whsName:string;
    unitOfMeasureName:string;
    isTax: boolean;

    constructor(data?: DocumentDetailModel) {
        if (data != null) {
            this.docDetailId= data.docDetailId;
            this.docId= data.docId;
            this.itemId= data.itemId;
            this.quantity= data.quantity;
            this.price= data.price;
            this.dueDate= data.dueDate;
            this.lineTotal= data.lineTotal;
            this.taxValue= data.taxValue;
            this.whsCode= data.whsCode;
            this.unitOfMeasureId= data.unitOfMeasureId;
            this.isDelete= data.isDelete;
            this.isTax = data.isTax;
            return
        }
        this.docDetailId= this.docDetailId;
        this.docId= this.docId;
        this.itemId= this.itemId;
        this.quantity= this.quantity;
        this.price= this.price;
        this.dueDate= this.dueDate;
        this.lineTotal= this.lineTotal;
        this.taxValue= this.taxValue;
        this.whsCode= this.whsCode;
        this.unitOfMeasureId= this.unitOfMeasureId;
        this.isDelete= this.isDelete;
        this.isTax = this.isTax;
    }
}
