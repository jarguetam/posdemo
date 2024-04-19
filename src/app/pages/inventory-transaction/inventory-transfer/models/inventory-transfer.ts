import { InventoryTransferDetailModel } from "./inventory-transfer-detail";

export class InventoryTransferModel{
    transferId: number;
    transferDate: Date;
    comment: string;
    docTotal: number;
    qtyTotal: number;
    fromWhsCode: number;
    fromWhsName: string;
    toWhsCode: number;
    toWhsName: string;
    createBy: number;
    createByName: string;
    transferRequestId: number;
    detail: InventoryTransferDetailModel[];

    constructor(data?: InventoryTransferModel) {
        if (data != null) {
            this.transferId = data.transferId;
            this.transferDate = data.transferDate;
            this.comment = data.comment;
            this.docTotal = data.docTotal;
            this.qtyTotal = data.qtyTotal;
            this.fromWhsCode = data.fromWhsCode;
            this.fromWhsName = data.fromWhsName;
            this.toWhsCode = data.toWhsCode;
            this.toWhsName = data.toWhsName;
            this.createBy = data.createBy;
            this.createByName = data.createByName;
            this.detail = data.detail;
            this.transferRequestId = data.transferRequestId;
            return;
        }
        this.transferId = this.transferId;
        this.transferDate = this.transferDate;
        this.detail = [];
        this.comment = this.comment;
        this.docTotal = this.docTotal;
        this.qtyTotal = this.qtyTotal;
        this.fromWhsCode = this.fromWhsCode;
        this.fromWhsName = this.fromWhsName;
        this.toWhsCode = this.toWhsCode;
        this.toWhsName = this.toWhsName;
        this.createBy = this.createBy;
        this.createByName = this.createByName;
        this.transferRequestId = this.transferRequestId;
    }
}
