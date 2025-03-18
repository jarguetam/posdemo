export interface CustomerBalanceModel {
    bpId:             number;
    bpType:           string;
    bpJournalId:      number;
    documentTypeId:   number;
    customerCode:     string;
    customerName:     string;
    docId:            number;
    transValue:       number;
    documentReferent: number;
    documents:        string;
    createDate:       Date;
    sellerName:       string;
    fecha:            Date;
    referencia:       string;
    condicion:        string;
    debe:             number;
    haber:            number;
    saldoAnterior:    number;
    balance:          number;
}
