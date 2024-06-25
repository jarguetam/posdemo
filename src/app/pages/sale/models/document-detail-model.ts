export class DocumentSaleDetailModel{
    docDetailId: number;
    docId: number;
    itemId: number;
    quantity: number;
    price: number;
    stock:number;
    cost: number;
    dueDate: Date;
    lineTotal: number;
    whsCode: number;
    unitOfMeasureId: number;
    isDelete: boolean;
    isTax: boolean;
    itemCode:string;
    itemName:string;
    whsName:string;
    taxValue: number;
    unitOfMeasureName:string;
    weight:number;

    constructor(data?: DocumentSaleDetailModel) {
        if (data != null) {
            this.docDetailId= data.docDetailId;
            this.docId= data.docId;
            this.itemId= data.itemId;
            this.quantity= data.quantity;
            this.price= data.price;
            this.cost= data.cost;
            this.dueDate= data.dueDate;
            this.lineTotal= data.lineTotal;
            this.whsCode= data.whsCode;
            this.taxValue =data.taxValue;
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
        this.cost= this.cost;
        this.dueDate= this.dueDate;
        this.lineTotal= this.lineTotal;
        this.whsCode= this.whsCode;
        this.taxValue =this.taxValue;
        this.unitOfMeasureId= this.unitOfMeasureId;
        this.isDelete= this.isDelete;
        this.isTax = this.isTax;
    }
}
