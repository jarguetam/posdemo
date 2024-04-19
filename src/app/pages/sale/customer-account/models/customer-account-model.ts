export class CustomerAccountModel{
    customerId: number;
    customerCode: string;
    customerName: string;
    sellerName: string;
    sellerId: number;
    payConditionName: string;
    invoiceNumber: number;
    dueDate: Date;
    balance: number;
    unexpiredBalance: number;
    balanceDue: number;
    balanceAt30Days: number;
    balanceFrom31To60Days: number;
    balanceFrom61To90Days: number;
    balanceFrom91To120Days: number;
    balanceMoreThan120Days: number;
    daysExpired: number;
}
