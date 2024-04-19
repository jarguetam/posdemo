export class SupplierModel {
    supplierId: number;
    supplierName: string;
    supplierCode: string;
    rtn: string;
    phone: string;
    email: string;
    address: string;
    supplierCategoryId: number;
    categoryName: string;
    payConditionId: number;
    payConditionName: string;
    payConditionDays: number;
    balance: number;
    creditLine: number;
    tax: true;
    createBy: number;
    createByName: string;
    createDate: Date;
    updateBy: number;
    updateDate: Date;
    active: true;
}
