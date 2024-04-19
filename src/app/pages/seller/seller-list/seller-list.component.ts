import { SellerModel } from './../models/seller';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SellerService } from '../service/seller.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import { SellerDialogComponent } from '../components/seller.dialog/seller.dialog.component';

@Component({
    selector: 'app-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.scss'],
})
export class SellerListComponent implements OnInit {
    @ViewChild(SellerDialogComponent) SellerDialog: SellerDialogComponent;
    title: string = 'Listado de Rutas';
    sellerList: SellerModel[];
    loading: boolean = false;
    constructor(
        private sellerService: SellerService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getSellerRegion();
    }

    async _getSellerRegion() {
        try {
            this.loading = true;
            this.sellerList = await this.sellerService.getSeller();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    sellerModify(seller)
    {
        this.sellerList= seller;
    }

    editSeller(seller: SellerModel){
        if(!this.auth.hasPermission("btn_edit_vendor")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.SellerDialog.showDialog(seller, false);
      }

      addSeller(){
        if(!this.auth.hasPermission("btn_add_vendor")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.SellerDialog.showDialog(new SellerModel(), true);
      }
}
