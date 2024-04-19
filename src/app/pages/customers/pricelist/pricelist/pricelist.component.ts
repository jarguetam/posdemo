import { PricelistDetailComponent } from './../pricelist-detail/pricelist-detail.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { PriceListModel } from '../../models/pricelist';
import { CustomersService } from '../../service/customers.service';
import { PricelistdialogComponent } from '../pricelistdialog/pricelistdialog.component';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.scss']
})
export class PricelistComponent implements OnInit {
    @ViewChild(PricelistdialogComponent) Pricelistdialog: PricelistdialogComponent;
    @ViewChild(PricelistDetailComponent) PricelistDetail: PricelistDetailComponent;
    title: string = "Listado de listas de precio";
    priceListList: PriceListModel[];
    loading: boolean = false;
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getPriceList();
    }

    async _getPriceList() {
        try {
            this.loading = true;
            this.priceListList = await this.customerService.getPriceList();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    priceListModify(priceList)
    {
        this.priceListList= priceList;
    }

    editPriceList(priceList: PriceListModel){
        if(!this.auth.hasPermission("btn_edit_pricelist")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.Pricelistdialog.showDialog(priceList, false);
      }

      addPriceList(){
        if(!this.auth.hasPermission("btn_add_pricelist")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.Pricelistdialog.showDialog(new PriceListModel(), true);
      }

      addPrice(priceList: number){
        if(!this.auth.hasPermission("btn_add_price_detail")){
            Messages.warning("No tiene acceso", "No puede ver los precios, por favor solicite el acceso")
            return;
          }
          this.PricelistDetail.showDialog(priceList, false);
      }

}
