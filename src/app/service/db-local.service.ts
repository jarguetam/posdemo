import { Injectable } from '@angular/core';
import { DocumentSaleModel } from '../pages/sale/models/document-model';
import Dexie, { Table } from 'dexie';
import { ItemWareHouse } from '../pages/items/models/item-warehouse';
import { CustomerModel } from '../pages/customers/models/customer';
import { User } from '../models/user';
import { PayCondition } from '../models/paycondition';
import { WareHouseModel } from '../pages/items/warehouse/models/warehouse';
import { Correlative } from '../models/correlative-sar';
import { SellerModel } from '../pages/seller/models/seller';
import { WizardModel } from '../components/wizard-configuration/model/wizard-model';
import { PaymentSaleModel } from '../pages/sales-payment/models/payment-sale-model';
import { Messages } from '../helpers/messages';
import { InventoryReturnModel } from '../pages/inventory-transaction/inventory-return/models/inventory-return-model';

@Injectable({
    providedIn: 'root',
})
export class DbLocalService extends Dexie {
    invoice!: Table<DocumentSaleModel, number>;
    inventory!: Table<ItemWareHouse, number>;
    customers!: Table<CustomerModel, number>;
    user!: Table<User, number>;
    payCondition!: Table<PayCondition, number>;
    wareHouse!: Table<WareHouseModel, number>;
    correlative!: Table<Correlative, number>;
    seller!: Table<SellerModel, number>;
    wizard!: Table<WizardModel, number>;
    invoiceSeller!: Table<DocumentSaleModel, number>;
    payment!: Table<PaymentSaleModel, number>;
    orderSales!: Table<DocumentSaleModel, number>;
    inventoryReturn!: Table<InventoryReturnModel, number>;

    constructor() {
        super('dbposweb');
        this.version(25).stores({
            invoice: '++id, uuid, customerId',
            inventory: '++id, listPriceId, itemId',
            customers: '++id, customerId',
            user: '++id, userName',
            payCondition: '++id',
            wareHouse: '++id',
            correlative: '++id, correlativeId',
            seller: '++id',
            wizard: '++id, complete',
            invoiceSeller: '++id, customerId, docId',
            payment:'++id, uuid',
            orderSales: '++id',
            inventoryReturn: '++idOffline'
        });
        this.open()
            .then((data) => console.log('DB Opened'))
            .catch((err) => Messages.warning(err.message));
    }

    async clearAllTables() {
        try {
            await this.inventory.clear();
            await this.customers.clear();
          //  await this.user.clear();
            await this.payCondition.clear();
            await this.wareHouse.clear();
            await this.correlative.clear();
            await this.seller.clear();
            await this.invoiceSeller.clear();
            await this.payment.clear();
            await this.orderSales.clear();
        } catch (error) {
            console.error('Error clearing tables:', error);
        }
    }

}
