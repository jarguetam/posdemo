export class LiquidationDetailModel {
    liquidationDetailId: number;
    liquidationId: number;
    docNum: number;
    docType: string;
    reference: string;
    docDate: Date;
    customerCode: string;
    customerName: string;
    docTotal: number;

    constructor(data?: LiquidationDetailModel) {
        if (data != null) {
            this.liquidationDetailId = data.liquidationDetailId;
            this.liquidationId = data.liquidationId;
            this.docNum = data.docNum;
            this.docType = data.docType;
            this.reference = data.reference;
            this.docDate = data.docDate;
            this.customerCode = data.customerCode;
            this.customerName = data.customerName;
            this.docTotal = data.docTotal;
            return;
        }

        this.liquidationDetailId = 0;
        this.liquidationId = 0;
        this.docNum = 0;
        this.docType = '';
        this.reference = '';
        this.docDate = new Date();
        this.customerCode = '';
        this.customerName = '';
        this.docTotal = 0;
    }
}

