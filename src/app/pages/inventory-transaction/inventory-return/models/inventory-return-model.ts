import { InventoryReturnDetailModel } from "./inventory-return-detail";

export class InventoryReturnModel {
    idOffline:   number;
    id:          number;
    docDate:     Date;
    sellerId:    number;
    sellerName: string;
    regionName: string;
    regionId:    number;
    whsCode:     number;
    createdDate: Date;
    createdBy:   number;
    createdByName:   string;
    canceled:    boolean;
    active:      boolean;
    detail:      InventoryReturnDetailModel[];
    complete: boolean;
    offline: boolean =false;
}

