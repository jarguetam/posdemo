import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { PointSale } from 'src/app/models/point-sale';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { PointSaleDialogComponent } from '../point-sale.dialog/point-sale.dialog.component';

@Component({
  selector: 'app-list.point-sale',
  templateUrl: './list.point-sale.component.html',
  styleUrls: ['./list.point-sale.component.scss']
})
export class ListPointSaleComponent implements OnInit {
    pointSaleList: PointSale[];
    @ViewChild(PointSaleDialogComponent) PointSaleDialog: PointSaleDialogComponent;
    loading:boolean = false;
    title: string = "Puntos  de facturación";
    constructor(private commonService: CommonService, private auth: AuthService ) {}

    ngOnInit() {
     this._getPointsSale();
    }

    async _getPointsSale(){
      try{
        this.loading = true;
        this.pointSaleList = await this.commonService.getPointSale();


        Messages.closeLoading();
        this.loading = false;
      }
      catch(ex){
        this.loading = false;
        Messages.warning("Advertencia", ex);
      }
    }

    editMode(point: PointSale){
      this.PointSaleDialog.showDialog(point, false);
    }

    add(){
        this.PointSaleDialog.showDialog(new PointSale(), true);
      }


    modeModify(point: PointSale[]){
      this.pointSaleList = point;
    }

}
