import { CompanyInfo } from './../../../models/company-info';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyInfoDialogComponent } from '../components/company-info.dialog.component';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
  selector: 'app-list.company-info',
  templateUrl: './list.company-info.component.html',
  styleUrls: ['./list.company-info.component.scss']
})
export class ListCompanyInfoComponent implements OnInit {
    companyInfo: CompanyInfo[];
    @ViewChild(CompanyInfoDialogComponent) CompanyInfoDialog: CompanyInfoDialogComponent;
    loading:boolean = false;
    title: string = "Informacion de empresa";
    constructor(private commonService: CommonService, private auth: AuthService ) {}

    ngOnInit() {
     this._getCompanyInfo();
    }

    async _getCompanyInfo(){
      try{
        this.loading = true;
        this.companyInfo = await this.commonService.getCompanyInfo();
        Messages.closeLoading();
        this.loading = false;
      }
      catch(ex){
        this.loading = false;
        Messages.warning("Advertencia", ex);
      }
    }

    editMode(companyInfo: CompanyInfo){
      if(!this.auth.hasPermission("btn_edit_company")){
        Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
        return;
      }
      this.CompanyInfoDialog.showDialog(companyInfo, false);
    }


    modeModify(modes: CompanyInfo[]){
      this.companyInfo = modes;
    }
}
