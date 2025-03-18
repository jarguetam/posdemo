export interface ItemBrowserModel {
    itemId:            number;
    itemCode:            string;
    barCode:             string;
    itemName:            string;
    stockAlmacenOrigen:  number;
    stockAlmacenDestino: number;
    cantidad:            number;
    dueDate:             Date;
    avgPrice:            number;
    unitOfMeasureId:     number;
    unitOfMeasureName:   string;
    itemCategoryName: string;
}
