import { CommonService } from 'src/app/service/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PayCondition } from 'src/app/models/paycondition';
import { PayconditiondialogComponent } from '../payconditiondialog/payconditiondialog.component';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
  selector: 'app-payconditionlist',
  templateUrl: './payconditionlist.component.html',
  styleUrls: ['./payconditionlist.component.scss']
})
export class PayconditionlistComponent implements OnInit {
    @ViewChild(PayconditiondialogComponent) Payconditiondialog: PayconditiondialogComponent;
    title: string = "Listado de condiciones de pagos";
    payConditionList: PayCondition[];
    loading: boolean = false;
    constructor(
        private commonService: CommonService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getPayCondition();
    }

    async _getPayCondition() {
        try {
            this.loading = true;
            this.payConditionList = await this.commonService.getPayCondition();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    payConditionModify(payCondition)
    {
        this.payConditionList= payCondition;
    }

    editPayCondition(payCondition: PayCondition){
        if(!this.auth.hasPermission("btn_edit_pay_condition")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.Payconditiondialog.showDialog(payCondition, false);
      }

      addPayCondition(){
        if(!this.auth.hasPermission("btn_add_pay_condition")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.Payconditiondialog.showDialog(new PayCondition(), true);
      }


}
