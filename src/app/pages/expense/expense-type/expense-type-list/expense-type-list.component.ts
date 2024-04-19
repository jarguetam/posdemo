import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseTypeDialogComponent } from '../expense-type-dialog/expense-type-dialog.component';
import { ExpenseTypeModel } from '../../models/expense-type-model';
import { ExpenseService } from '../../services/expense.service';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.scss']
})
export class ExpenseTypeListComponent implements OnInit {
    @ViewChild(ExpenseTypeDialogComponent) ExpenseTypeDialogComponent: ExpenseTypeDialogComponent;
    title: string = "Listado de tipos de gastos";
    expenseTypeList: ExpenseTypeModel[];
    loading: boolean = false;
    constructor(
        private expenseService: ExpenseService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getExpenseType();
    }

    async _getExpenseType() {
        try {
            this.loading = true;
            this.expenseTypeList = await this.expenseService.getExpenseType();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    expenseTypeModify(customerCategory)
    {
        this.expenseTypeList= customerCategory;
    }

    editExpenseType(customerCategory: ExpenseTypeModel){
        if(!this.auth.hasPermission("btn_edit_expense")){
          Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
          return;
        }
        this.ExpenseTypeDialogComponent.showDialog(customerCategory, false);
      }

      addExpenseType(){
        if(!this.auth.hasPermission("btn_add_expense")){
          Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
          return;
        }
        this.ExpenseTypeDialogComponent.showDialog(new ExpenseTypeModel(), true);
      }
}
