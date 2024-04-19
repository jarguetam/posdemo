import { PriceSpecialCustomerModel } from './../../models/price-special-customer';
import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { PriceListDetailModel } from '../../models/pricelist-detail';
import { CustomersService } from '../../service/customers.service';

@Component({
    selector: 'app-customer-special-price-dialog',
    templateUrl: './customer-special-price-dialog.component.html',
    styleUrls: ['./customer-special-price-dialog.component.scss'],
})
export class CustomerSpecialPriceDialogComponent implements OnInit {
    loading: boolean = false;
    priceListdetailList: PriceListDetailModel[];
    isAdd: boolean;
    display: boolean;
    usuario: User;
    customerId: number;
    customerCode: string;
    customerName: string;
    specialPrice: PriceSpecialCustomerModel[];
    listName: string;
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit(): void {}

    showDialog(priceListid: number, isAdd: boolean, customerId: number, customerCode: string, customerName: string, listName: string) {
        this.isAdd = isAdd;
        this.display = true;
        this.listName = listName;
        this.customerId = customerId;
        this.customerCode = customerCode;
        this.customerName = customerName
        this._getPriceListDetail(priceListid,customerId);
    }

    async _getPriceListDetail(priceid: number, customerId: number) {
        try {
            this.loading = true;
            this.priceListdetailList =
                await this.customerService.getPriceSpecialCustomerDetail(priceid,customerId);
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    addPrice(pricedetail: PriceListDetailModel) {
        this.priceListdetailList.find(
            (x) => x.priceListDetailId == pricedetail.priceListDetailId
        ).isModified = true;
    }

    async savePrices() {
        let prices = this.priceListdetailList.filter(
            (x) => x.isModified == true && x.price > 0
        );

        this.specialPrice = prices.map((x) => {
            const priceSpecialId = 0;
            const customerId = this.customerId;
            const itemId = x.itemId;
            const priceSpecial = x.priceSpecial;
            const priceListId= 1;
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

    close() {
        this.display = false;
    }
}
