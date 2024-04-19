import { InventoryRequestTransferDetail } from "./inventory-request-transfer-detail";

export class InventoryRequestTransfer{
    transferRequestId: number;
    transferRequestDate: Date;
    comment: string;
    docTotal: number;
    qtyTotal: number;
    fromWhsCode: number;
    fromWhsName: string;
    toWhsCode: number;
    toWhsName: string;
    createBy: number;
    createByName: string;
    complete: boolean;
    detail: InventoryRequestTransferDetail[];

    constructor(data?: InventoryRequestTransfer) {
        if (data != null) {
            this.transferRequestId = data.transferRequestId;
            this.transferRequestDate = data.transferRequestDate;
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
            this.complete = data.complete;
            return;
        }
        this.transferRequestId = this.transferRequestId;
        this.transferRequestDate = this.transferRequestDate;
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
        this.complete = this.complete;
    }
}
