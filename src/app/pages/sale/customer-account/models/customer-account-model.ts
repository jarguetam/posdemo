export class CustomerAccountModel{
    customerId: number;
    customerCode: string;
    customerName: string;
    sellerName: string;
    frecuency: string;
    sellerId: number;
    payConditionName: string;
    uuid: string;
    payConditionId: number;
    invoiceNumber: number;
    dueDate: Date;
    docDate: Date;
    docTotal: number;
    subTotal: number;
    tax: number;
    discountsTotal: number;
    paidToDate: number;
    balance: number;
    unexpiredBalance: number;
    balanceDue: number;
    balanceAt30Days: number;
    balanceFrom31To60Days: number;
    balanceFrom61To90Days: number;
    balanceFrom91To120Days: number;
    balanceMoreThan120Days: number;
    daysExpired: number;
    id: number;
}
