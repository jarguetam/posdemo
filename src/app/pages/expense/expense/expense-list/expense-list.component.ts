import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { ExpenseModel } from '../../models/expense-model';
import { ExpenseService } from '../../services/expense.service';
import { Messages } from 'src/app/helpers/messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
    @ViewChild(ExpenseDialogComponent)
    ExpenseDialogComponent: ExpenseDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de gastos registrados';
    expenseList: ExpenseModel[];
    formFilter: FormGroup;
    constructor(
        private expenseService: ExpenseService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            to: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.expenseList = await this.expenseService.getExpenseByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    expenseModify(expense: ExpenseModel[]) {
        this.expenseList = expense;
    }

    addExpense() {
        if(!this.auth.hasPermission("btn_add")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso.")
             return;
           }
        this.ExpenseDialogComponent.showDialog(new ExpenseModel(), true);
    }

    editExpense(expense: ExpenseModel){
        if(!this.auth.hasPermission("btn_edit")){
            Messages.warning("No tiene acceso", "No puede editar pedidos, por favor solicite el acceso.")
            return;
          }
       this.ExpenseDialogComponent.showDialog(expense, false);
    }

    viewExpense(expense: ExpenseModel) {
        if(!this.auth.hasPermission("btn_edit")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso.")
             return;
           }
        this.ExpenseDialogComponent.showDialog(expense, false);
    }

}
