import { PaymentSaleDetailModel } from "./payment-sale-detail-model";

export class PaymentSaleModel{
    id: number;
    docId: number;
    customerId: number;
    customerCode: string;
    customerName: string;
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
    detail: PaymentSaleDetailModel[];
    payConditionName: string;
    createByName:string;
    sellerId: number;



    constructor(data?: PaymentSaleModel) {
        if(data!=null){
            this.docId = data.docId;
            this.customerId = data.customerId;
            this.customerCode = data.customerCode;
            this.customerName = data.customerName;
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
            this.sellerId = data.sellerId;
            return;
        }
        this.docId = this.docId;
        this.customerId = this.customerId;
        this.customerCode = this.customerCode;
        this.customerName = this.customerName;
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
        this.sellerId = this.sellerId;
        return;
    }
}
