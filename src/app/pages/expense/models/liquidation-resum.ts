export interface LiquidationResumModel {
    resum:  Resum[];
    detail: Detail[];
}

export interface Detail {
    docTypeCode:  string;
    customerName: string;
    total:        number;
}

export interface Resum {
    docType: string;
    total:   number;
}
