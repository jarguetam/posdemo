export class CostRevaluationModel {
    id: number;
    itemId: number;
    previousCost: number;
    newCost: number;
    createDate: Date;
    createBy: number;
    comment: string;
    whsCode: number;
    itemCode: string;
    itemName: string;
    whsName: string;
    createByName: string;
    detail: CostRevaluationModel[];

    constructor(data?: CostRevaluationModel) {
        if (data != null) {
            this.id = data.id;
            this.itemId = data.itemId;
            this.itemName = data.itemName;
            this.previousCost = data.previousCost;
            this.newCost = data.newCost;
            this.createDate = data.createDate;
            this.createBy = data.createBy;
            this.comment = data.comment;
            this.whsCode = data.whsCode;
            this.itemCode = data.itemCode;
            this.whsCode = data.whsCode;
            this.whsName = data.whsName;
            this.createByName = data.createByName;
            this.detail = data.detail;
            return;
        }
        this.id = this.id;
        this.itemId = this.itemId;
        this.itemName = this.itemName;
        this.previousCost = this.previousCost;
        this.newCost = this.newCost;
        this.createDate = this.createDate;
        this.createBy = this.createBy;
        this.comment = this.comment;
        this.whsCode = this.whsCode;
        this.itemCode = this.itemCode;
        this.whsCode = this.whsCode;
        this.whsName = this.whsName;
        this.createByName = this.createByName;
        this.detail = this.detail;
        return;
    }
}
