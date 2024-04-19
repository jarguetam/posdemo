import { ExpenseDetailModel } from "./expense-detail-model";

export class ExpenseModel {
    createByName: string;
    sellerName: string;
    expenseId: number;
    expenseDate: Date;
    comment: string;
    total: number;
    createdBy: number;
    createdDate: Date;
    sellerId: number;
    active: boolean;
    detail: ExpenseDetailModel[];

    constructor(data?: ExpenseModel) {
        if (data != null) {
            this.createByName = data.createByName;
            this.sellerName = data.sellerName;
            this.expenseId = data.expenseId;
            this.expenseDate = data.expenseDate;
            this.comment = data.comment;
            this.total = data.total;
            this.createdBy = data.createdBy;
            this.createdDate = data.createdDate;
            this.sellerId = data.sellerId;
            this.active = data.active;
            this.detail = data.detail?.map(detail => new ExpenseDetailModel(detail)) || [];
            return;
        }

        this.createByName = this.createByName;
        this.sellerName = this.sellerName;
        this.expenseId = this.expenseId;
        this.expenseDate = new Date();
        this.comment = this.comment;
        this.total = this.total;
        this.createdBy = this.createdBy;
        this.createdDate = this.createdDate;
        this.sellerId = this.sellerId;
        this.active = this.active;
        this.detail = [];
    }
}

