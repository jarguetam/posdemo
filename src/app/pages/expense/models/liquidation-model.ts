import { LiquidationDetailModel } from "./liquidation-detail-model";

export class LiquidationModel {
    idLiquidation: number;
    sellerId: number;
    from: Date;
    to: Date;
    saleCredit: number;
    saleCash: number;
    saleTotal: number;
    paidTotal: number;
    expenseTotal: number;
    total: number;
    deposit: number;
    totalDifference: number;
    createdDate: Date;
    createdBy: number;
    active: boolean;
    detail: LiquidationDetailModel[];
    createdByName: string;
    sellerName: string;

    constructor(data?: LiquidationModel) {
        if (data != null) {
            this.idLiquidation = data.idLiquidation;
            this.sellerId = data.sellerId;
            this.from = data.from;
            this.to = data.to;
            this.saleCredit = data.saleCredit;
            this.saleCash = data.saleCash;
            this.saleTotal = data.saleTotal;
            this.paidTotal = data.paidTotal;
            this.expenseTotal = data.expenseTotal;
            this.total = data.total;
            this.deposit = data.deposit;
            this.totalDifference = data.totalDifference;
            this.createdDate = data.createdDate;
            this.createdBy = data.createdBy;
            this.active = data.active;
            this.detail = data.detail?.map(detail => new LiquidationDetailModel(detail)) || [];
            this.createdByName = data.createdByName;
            this.sellerName = data.sellerName;
            return;
        }

        this.idLiquidation = this.idLiquidation;
        this.sellerId = this.sellerId;
        this.from =  new Date();
        this.to =  new Date();
        this.saleCredit = this.saleCredit;
        this.saleCash = this.saleCash;
        this.saleTotal = this.saleTotal;
        this.paidTotal = this.paidTotal;
        this.expenseTotal = this.expenseTotal;
        this.total = this.total;
        this.deposit = this.deposit;
        this.totalDifference = this.totalDifference;
        this.createdDate = this.createdDate;
        this.createdBy = this.createdBy;
        this.active = true;
        this.detail = [];
        this.createdByName = this.createdByName;
        this.sellerName = this.sellerName;
    }
}

