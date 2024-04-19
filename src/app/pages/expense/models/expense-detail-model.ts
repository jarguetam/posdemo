export class ExpenseDetailModel {
    expenseTypeName: string;
    expenseDetailId: number;
    expenseId:       number;
    expenseTypeId:   number;
    reference:       string;
    lineTotal:       number;
    isDeleted: boolean;

    constructor(data?: ExpenseDetailModel) {
        if (data != null) {
            this.expenseTypeName = data.expenseTypeName;
            this.expenseDetailId = data.expenseDetailId;
            this.expenseId = data.expenseId;
            this.expenseTypeId = data.expenseTypeId;
            this.reference = data.reference;
            this.lineTotal = data.lineTotal;
            return;
        }

        this.expenseTypeName = "";
        this.expenseDetailId = 0;
        this.expenseId = 0;
        this.expenseTypeId = 0;
        this.reference = "";
        this.lineTotal = 0;
    }
}
