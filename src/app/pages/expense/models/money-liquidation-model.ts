import { SellerModel } from "../../seller/models/seller";
import { SellerRegion } from "../../seller/models/seller-region";

export interface MoneyLiquidationModel {
    liquidationId: number;
    expenseDate:   Date;
    comment:       string;
    total:         number;
    deposit:         number;
    sellerId:      number;
    createdBy:     number;
    createdAt:     Date;
    updatedAt:     Date;
    details:       MoneyLiquidationDetail[];
    seller: SellerModel;
}

export interface MoneyLiquidationDetail {
    detailId:      number;
    liquidationId: number;
    moneyId:       number;
    denominacion:  string;
    quantity:      number;
    total:         number;
}
