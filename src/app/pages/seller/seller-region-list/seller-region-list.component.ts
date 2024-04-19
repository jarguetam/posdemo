import { SellerRegionDialogComponent } from './../components/seller-region.dialog/seller-region.dialog.component';
import { AuthService } from 'src/app/service/users/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { SellerRegion } from '../models/seller-region';
import { SellerService } from './../service/seller.service';

@Component({
    selector: 'app-seller-region-list',
    templateUrl: './seller-region-list.component.html',
    styleUrls: ['./seller-region-list.component.scss'],
})

export class SellerRegionListComponent implements OnInit {
    @ViewChild(SellerRegionDialogComponent) SellerRegionDialog: SellerRegionDialogComponent;
    title: string = "Listado de vendedores";
    sellerRegionList: SellerRegion[];
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
            this.sellerRegionList = await this.sellerService.getSellerRegion();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    sellerRegionModify(sellerRegion)
    {
        this.sellerRegionList= sellerRegion;
    }

    editSellerRegion(sellerRegion: SellerRegion){
        if(!this.auth.hasPermission("btn_edit_sellerregion")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.SellerRegionDialog.showDialog(sellerRegion, false);
      }

      addSellerRegion(){
        if(!this.auth.hasPermission("btn_add_sellerregion")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.SellerRegionDialog.showDialog(new SellerRegion(), true);
      }
}
