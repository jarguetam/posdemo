export class PaymentDetailModel{
    docDetailId: number;
    docId: number;
    invoiceId: number;
    invoiceReference: string;
    invoiceDate: Date;
    dueDate: Date;
    subTotal: number;
    taxTotal: number;
    discountTotal: number;
    lineTotal: number;
    isDelete: boolean;
    balance: number;
    sumApplied: number;
    reference: string;


    constructor(data?: PaymentDetailModel) {
        if (data != null) {
            this.docDetailId= data.docDetailId;
            this.docId= data.docId;
            this.invoiceId= data.invoiceId;
            this.invoiceReference= data.invoiceReference;
            this.dueDate= data.dueDate;
            this.invoiceDate= data.invoiceDate;
            this.subTotal = data.subTotal;
            this.taxTotal = data.taxTotal;
            this.discountTotal = data.discountTotal;
            this.lineTotal= data.lineTotal;
            this.reference = data.reference;
            return
        }
        this.docDetailId= this.docDetailId;
        this.docId= this.docId;
        this.invoiceId= this.invoiceId;
        this.invoiceReference= this.invoiceReference;
        this.invoiceDate= this.invoiceDate;
        this.subTotal = this.subTotal;
        this.taxTotal = this.taxTotal;
        this.discountTotal = this.discountTotal;
        this.lineTotal= this.lineTotal;
        this.reference = this.reference;
    }
}
