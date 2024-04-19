export class Correlative {
    userName:           string;
    pointSale:          string;
    branch:             string;
    correlativeId:      number;
    authorizeRangeFrom: number;
    authorizeRangeTo:   number;
    currentCorrelative: number;
    cai:                string;
    branchId:           string;
    pointSaleId:        string;
    typeDocument:       string;
    typeDocumentName: string;
    dateLimit:          Date;
    userId:             number;
    createDate:         Date;
    description: string;

    constructor(data?: Correlative){
        if(data!= null){
            this.userName = data.userName;
            this.pointSale= data.pointSale;
            this.branch= data.branch;
            this.correlativeId= data.correlativeId;
            this.authorizeRangeFrom= data.authorizeRangeFrom;
            this.authorizeRangeTo= data.authorizeRangeTo;
            this.currentCorrelative= data.currentCorrelative;
            this.cai= data.cai;
            this.branchId= data.branchId;
            this.pointSaleId= data.pointSaleId;
            this.typeDocument= data.typeDocument;
            this.typeDocumentName= data.typeDocumentName;
            this.dateLimit= data.dateLimit;
            this.userId= data.userId;
            this.createDate= data.createDate;
            return;
        }
        this.userName = this.userName;
        this.pointSale= this.pointSale;
        this.branch= this.branch;
        this.correlativeId= this.correlativeId;
        this.authorizeRangeFrom= this.authorizeRangeFrom;
        this.authorizeRangeTo= this.authorizeRangeTo;
        this.currentCorrelative= this.currentCorrelative;
        this.cai= this.cai;
        this.branchId= this.branchId;
        this.pointSaleId= this.pointSaleId;
        this.typeDocument= this.typeDocument;
        this.typeDocumentName= this.typeDocumentName;
        this.dateLimit= this.dateLimit;
        this.userId= this.userId;
        this.createDate= this.createDate;

    }
}
