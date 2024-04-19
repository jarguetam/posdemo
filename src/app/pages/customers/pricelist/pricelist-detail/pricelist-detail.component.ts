import { User } from 'src/app/models/user';
import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { PriceListDetailModel } from '../../models/pricelist-detail';
import { CustomersService } from '../../service/customers.service';

@Component({
    selector: 'app-pricelist-detail',
    templateUrl: './pricelist-detail.component.html',
    styleUrls: ['./pricelist-detail.component.scss'],
})
export class PricelistDetailComponent implements OnInit {
    loading: boolean = false;
    priceListdetailList: PriceListDetailModel[];
    isAdd: boolean;
    display: boolean;
    usuario: User;
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit(): void {}

    showDialog(priceListid: number, isAdd: boolean) {
        this.isAdd = isAdd;
        this.display = true;
        this._getPriceListDetail(priceListid);
    }

    async _getPriceListDetail(priceid: number) {
        try {
            this.loading = true;
            this.priceListdetailList =
                await this.customerService.getPriceListDetail(priceid);
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

        prices.map((x) => {
            x.updateBy = this.usuario.userId;
        })
        try {
            Messages.loading('Editando', 'Editando precios');
            let users = await this.customerService.editPriceListDetail(prices);
            Messages.closeLoading();
            Messages.Toas('Editado Correctamente');
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
