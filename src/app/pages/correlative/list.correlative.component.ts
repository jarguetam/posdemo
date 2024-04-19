import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { Correlative } from 'src/app/models/correlative-sar';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { CorrelativeDialogComponent } from './components/correlative.dialog/correlative.dialog.component';

@Component({
  selector: 'app-list.correlative',
  templateUrl: './list.correlative.component.html',
  styleUrls: ['./list.correlative.component.scss']
})
export class ListCorrelativeComponent implements OnInit {
    correlativeList: Correlative[];
    @ViewChild(CorrelativeDialogComponent) CorrelativeDialog: CorrelativeDialogComponent;
    loading:boolean = false;
    title: string = "Numeración de documentos";
    constructor(private commonService: CommonService, private auth: AuthService ) {}

    ngOnInit() {
     this._getCompanyInfo();
    }

    async _getCompanyInfo(){
      try{
        this.loading = true;
        this.correlativeList = await this.commonService.getCorrelative();
        Messages.closeLoading();
        this.loading = false;
      }
      catch(ex){
        this.loading = false;
        Messages.warning("Advertencia", ex);
      }
    }

    editMode(correlative: Correlative){
      this.CorrelativeDialog.showDialog(correlative, false);
    }

    add(){
        this.CorrelativeDialog.showDialog(new Correlative(), true);
      }


    modeModify(correlative: Correlative[]){
      this.correlativeList = correlative;
    }
}
