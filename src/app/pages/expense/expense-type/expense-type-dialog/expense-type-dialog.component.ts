import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { ExpenseService } from '../../services/expense.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ExpenseTypeModel } from '../../models/expense-type-model';

@Component({
    selector: 'app-expense-type-dialog',
    templateUrl: './expense-type-dialog.component.html',
    styleUrls: ['./expense-type-dialog.component.scss'],
})
export class ExpenseTypeDialogComponent implements OnInit {
    @Output() ExpenseTypeModify = new EventEmitter<ExpenseTypeModel[]>();
    expenseType: ExpenseTypeModel;
    isAdd: boolean;
    formExpense: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private expenseService: ExpenseService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
    }

    showDialog(expenseType: ExpenseTypeModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.expenseType = expenseType;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild() {
        this.formExpense = this.fb.group({
            expenseTypeId: [this.expenseType.expenseTypeId ?? 0],
            expenseName: [
                this.expenseType.expenseName ?? '',
                Validators.required,
            ],
            createdBy: [this.expenseType.createdBy ?? this.usuario.userId],

        });
    }

    new() {
        this.expenseType = undefined;
        this.formExpense = undefined;
    }

    async add() {
        if (this.formExpense.valid) {
            try {
                Messages.loading('Agregando', 'Agregando tipo de gasto');
                let request = this.formExpense.value as ExpenseTypeModel;
                let region = await this.expenseService.addExpenseType(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.ExpenseTypeModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formExpense.valid) {
            try {
                Messages.loading('Editando', 'Editando tipo de gasto');
                let request = this.formExpense.value as ExpenseTypeModel;
                let users = await this.expenseService.editExpenseType(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.ExpenseTypeModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
