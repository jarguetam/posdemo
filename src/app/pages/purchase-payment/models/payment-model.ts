import { PaymentDetailModel } from "./payment-detail-model";

export class PaymentModel{
    docId: number;
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    payConditionId: number;
    docDate: Date;
    canceled: true;
    comment: string;
    reference: string;
    cashSum: number;
    chekSum: number;
    transferSum: number;
    cardSum: number;
    docTotal: number;
    createBy: number;
    complete: boolean;
    detail: PaymentDetailModel[];
    payConditionName: string;
    createByName:string;


    constructor(data?: PaymentModel) {
        if(data!=null){
            this.docId = data.docId;
            this.supplierId = data.supplierId;
            this.supplierCode = data.supplierCode;
            this.supplierName = data.supplierName;
            this.payConditionId = data.payConditionId;
            this.docDate = data.docDate;
            this.canceled = data.canceled;
            this.comment = data.comment;
            this.reference = data.reference;
            this.cashSum = data.cashSum;
            this.chekSum = data.chekSum;
            this.transferSum = data.transferSum;
            this.cardSum = data.cardSum;
            this.docTotal = data.docTotal;
            this.createBy = data.createBy;
            this.complete = data.complete;
            this.detail = data.detail;
            return;
        }
        this.docId = this.docId;
        this.supplierId = this.supplierId;
        this.supplierCode = this.supplierCode;
        this.supplierName = this.supplierName;
        this.payConditionId = this.payConditionId;
        this.docDate = this.docDate;
        this.canceled = this.canceled;
        this.comment = this.comment;
        this.reference = this.reference;
        this.cashSum = this.cashSum;
        this.chekSum = this.chekSum;
        this.transferSum = this.transferSum;
        this.cardSum = this.cardSum;
        this.docTotal = this.docTotal;
        this.createBy = this.createBy;
        this.complete = this.complete;
        this.detail = [];
        return;
    }
}
