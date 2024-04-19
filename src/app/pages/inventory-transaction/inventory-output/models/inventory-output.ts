import { InventoryOutPutDetailModel } from "./inventory-output-detail";


export class InventoryOutPutModel{
    outputId: number;
    outputDate: Date;
    comment: string;
    docTotal: number;
    docQuantity: number;
    whsCode: number;
    type: number;
    typeName: string;
    createBy: number;
    whsName: string;
    createByName: string;
    detail: InventoryOutPutDetailModel[];

    constructor(data?: InventoryOutPutModel) {
        if (data != null) {
            this.outputId = data.outputId;
            this.outputDate = data.outputDate;
            this.comment = data.comment;
            this.docTotal = data.docTotal;
            this.docQuantity = data.docQuantity;
            this.whsCode = data.whsCode;
            this.createBy = data.createBy;
            this.whsName = data.whsName;
            this.createByName = data.createByName;
            this.detail = data.detail;
            return;
        }
        this.outputId = this.outputId;
        this.outputDate = this.outputDate;
        this.detail = [];
        this.comment = this.comment;
        this.docTotal = this.docTotal;
        this.docQuantity = this.docQuantity;
        this.whsCode = this.whsCode;
        this.createBy = this.createBy;
        this.whsName = this.whsName;
        this.createByName = this.createByName;
    }
}
