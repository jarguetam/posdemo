import { DocumentDetailModel } from './document-detail';

export class DocumentModel {
    docId: number;
    docReference: number;
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    payConditionId: number;
    payConditionDays: number;
    docDate: Date= new Date();
    dueDate: Date;
    canceled: true;
    comment: string;
    reference: string;
    subTotal: number;
    tax: number;
    disccounts: number;
    discountsTotal: number;
    docTotal: number;
    docQty: number;
    whsCode: number;
    createBy: number;
    complete: true;
    detail: DocumentDetailModel[];
    payConditionName: string;
    createByName:string;
    whsName: string;
    taxSupplier:boolean;
    sumApplied: number;
    balance: number;

    constructor(data?: DocumentModel) {
        if(data!=null){
            this.docId = data.docId;
            this.supplierId = data.supplierId;
            this.supplierCode = data.supplierCode;
            this.supplierName = data.supplierName;
            this.payConditionId = data.payConditionId;
            this.payConditionDays = data.payConditionDays;
            this.docDate = data.docDate;
            this.dueDate = data.dueDate;
            this.canceled = data.canceled;
            this.comment = data.comment;
            this.reference = data.reference;
            this.subTotal = data.subTotal;
            this.tax = data.tax;
            this.disccounts = data.disccounts;
            this.discountsTotal = data.discountsTotal;
            this.docTotal = data.docTotal;
            this.docQty = data.docQty;
            this.whsCode = data.whsCode;
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
        this.payConditionDays = this.payConditionDays;
        this.docDate = this.docDate;
        this.dueDate = this.dueDate;
        this.canceled = this.canceled;
        this.comment = this.comment;
        this.reference = this.reference;
        this.subTotal = this.subTotal;
        this.tax = this.tax;
        this.disccounts = this.disccounts;
        this.discountsTotal = this.discountsTotal;
        this.docTotal = this.docTotal;
        this.docQty = this.docQty;
        this.whsCode = this.whsCode;
        this.createBy = this.createBy;
        this.complete = this.complete;
        this.detail = [];
        return;
    }

}
