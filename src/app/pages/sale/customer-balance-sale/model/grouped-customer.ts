import { DocumentSaleModel } from "../../models/document-model";

export interface GroupedCustomer {
    customerId: number;
    customerCode: string;
    customerName: string;
    sellerName: string;
    total: number;
    totalBalance: number;
    totalPaidToDate: number;
}

export class PrintBalance{
    customer: GroupedCustomer;
    detail: DocumentSaleModel[];
    constructor(data?: PrintBalance) {
        if (data != null) {
            this.customer = data.customer;
            this.detail = data.detail;
            return;
        }
        this.customer = this.customer;
        this.detail = this.detail;
        return;
    }
}
