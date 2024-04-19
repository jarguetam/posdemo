import { InventoryEntryDetailModel } from "./inventory-entry-detail";

export class InventoryEntryModel{
    entryId: number;
    entryDate: Date;
    comment: string;
    docTotal: number;
    docQuantity: number;
    whsCode: number;
    type: number;
    typeName: string;
    createBy: number;
    whsName: string;
    createByName: string;
    detail: InventoryEntryDetailModel[];

    constructor(data?: InventoryEntryModel) {
        if (data != null) {
            this.entryId = data.entryId;
            this.entryDate = data.entryDate;
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
        this.entryId = this.entryId;
        this.entryDate = this.entryDate;
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
