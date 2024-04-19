import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ItemPriceCustomerModel } from '../../models/item-price-customer';
import { PriceSpecialCustomerModel } from '../../models/price-special-customer';
import { CustomersService } from '../../service/customers.service';
import { PriceListModel } from '../../models/pricelist';

@Component({
    selector: 'app-customer-price-list-assignment',
    templateUrl: './customer-price-list-assignment.component.html',
    styleUrls: ['./customer-price-list-assignment.component.scss'],
})
export class CustomerPriceListAssignmentComponent implements OnInit {
    loading: boolean = false;
    priceListdetailList: ItemPriceCustomerModel[];
    isAdd: boolean;
    display: boolean;
    usuario: User;
    customerId: number;
    customerCode: string;
    customerName: string;
    specialPrice: PriceSpecialCustomerModel[];
    listName: string;
    selectedValues: string[] = [];
    selectPrice: any;
    listNameList: PriceListModel[];
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit(): void {}

    showDialog(
        priceListid: number,
        isAdd: boolean,
        customerId: number,
        customerCode: string,
        customerName: string,
        listName: string
    ) {
        this.isAdd = isAdd;
        this.display = true;
        this.listName = listName;
        this.customerId = customerId;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this._getPriceListDetail(priceListid, customerId);
    }

    async _getPriceListDetail(priceid: number, customerId: number) {
        try {
            this.loading = true;
            this.priceListdetailList =
                await this.customerService.getItemPriceCustomer(
                    priceid,
                    customerId
                );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.listNameList = await this.customerService.getPriceListActive();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    seleccionarListaPrecio(item: ItemPriceCustomerModel, listaPrecio: string) {
        for (const i of this.priceListdetailList) {
            if (i.itemCode === item.itemCode) {
                i[listaPrecio] = true;
                i.isModified = true;
                i.price= i[listaPrecio.replace('Enabled', '')];
                i.listPriceId = Number.parseInt(listaPrecio.replace(/[^0-9]+/g, ""));
                for (const precio in i) {
                    if (
                        precio.startsWith('priceList') &&
                        precio.endsWith('Enabled') &&
                        precio !== listaPrecio
                    ) {
                        i[precio] = false;
                    }
                }
            }
        }
    }

    selectAllPriceList(listaPrecio: number) {
        for (const l of this.listNameList) {
            if (l.listPriceId === listaPrecio) {
                l.active = true;
            } else {
                l.active = false;
            }
        }
        for (const i of this.priceListdetailList) {
            i['priceList' + listaPrecio + 'Enabled'] = true;
            i.isModified = true;
            i.price= i['priceList' + listaPrecio];
            i.listPriceId = listaPrecio;
            for (const precio in i) {
                if (
                    precio.startsWith('priceList') &&
                    precio.endsWith('Enabled') &&
                    precio !== 'priceList' + listaPrecio + 'Enabled'
                ) {
                    i[precio] = false;
                }
            }
        }
    }

    async savePrices() {
        let prices = this.priceListdetailList.filter(
            (x) => x.isModified == true
        );

        this.specialPrice = prices.map((x) => {
            const priceSpecialId = 0;
            const customerId = this.customerId;
            const itemId = x.itemId;
            const priceSpecial = x.price;
            const priceListId = x.listPriceId;
            const createBy = this.usuario.userId;
            const createDate = new Date();
            const updateBy = 0;
            const updateDate = new Date();
            return {
                priceSpecialId,
                customerId,
                itemId,
                priceSpecial,
                priceListId,
                createDate,
                updateDate,
                createBy,
                updateBy,
            };
        });
        try {
            Messages.loading('Agregando', 'Agregando precios especiales');
            let users = await this.customerService.addSpecialPriceCustomer(
                this.specialPrice
            );
            Messages.closeLoading();
            Messages.Toas('Agregados Correctamente');
            this.display = false;
        } catch (ex) {
            Messages.closeLoading();
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    close(){
        this.display =false;
    }
}
