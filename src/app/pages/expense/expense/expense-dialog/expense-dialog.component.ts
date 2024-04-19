import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { ExpenseModel } from '../../models/expense-model';
import { ExpenseTypeModel } from '../../models/expense-type-model';
import { ExpenseDetailModel } from '../../models/expense-detail-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { Messages } from 'src/app/helpers/messages';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { SellerModel } from 'src/app/pages/seller/models/seller';

@Component({
    selector: 'app-expense-dialog',
    templateUrl: './expense-dialog.component.html',
    styleUrls: ['./expense-dialog.component.scss'],
})
export class ExpenseDialogComponent implements OnInit {
    @Output() ExpenseModify = new EventEmitter<ExpenseModel[]>();
    expense: ExpenseModel = new ExpenseModel();
    isAdd: boolean;
    disabled: boolean = false;
    formExpense: FormGroup;
    loading: boolean = false;
    usuario: User;
    doctotal: number = 0;
    expenseTypeList: ExpenseTypeModel[];
    detail: ExpenseDetailModel[] = [];
    index = 1;
    display: boolean;
    sellerList: SellerModel[];
    selectedExpenseTypeName: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private expenseService: ExpenseService,
        private auth: AuthService,
        private sellerService: SellerService
    ) {
        this.usuario = this.auth.UserValue;
    }
    ngOnInit(): void {}

    async _getSellers() {
        try {
            this.loading = true;
            this.sellerList = await this.sellerService.getSeller();
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione el vendedor',
                whsCode: 0,
                whsName: '',
                regionId: 0,
                regionName: '',
                createByName: '',
                createBy: 0,
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }
    async _getExpenseType() {
        try {
            this.loading = true;
            this.expenseTypeList = await this.expenseService.getExpenseType();
            this.expenseTypeList.unshift({
                expenseTypeId: 0,
                expenseName: 'Seleccione el tipo de gasto',
                createdBy: 0,
                createdDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                createdByName: '',
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(expenseNew: ExpenseModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = false;
        this.expense = expenseNew;
        this.doctotal = expenseNew.total;
        this.detail = expenseNew.detail;
        if (!isAdd) {
            this.index = expenseNew.detail.length;
        }
        this._createFormBuild();
        this._getExpenseType();
        this._getSellers();
    }

    _createFormBuild() {
        this.formExpense = this.formBuilder.group({
            expenseId: [this.expense.expenseId ?? 0],
            expenseDate: [
                new Date(this.expense.expenseDate)
                    .toISOString()
                    .substring(0, 10) ??
                    new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            comment: [this.expense.comment ?? '-'],
            total: [this.expense.total ?? ''],
            sellerId: [this.expense.sellerId ?? this.usuario.sellerId],
            createdBy: [this.expense.createdBy ?? this.usuario.userId],
            detail: [[]],
        });
    }

    new() {
        this.expense = undefined;
        this.formExpense = undefined;
    }

    addLine(
        expenseTypeName: ExpenseTypeModel,
        reference: string,
        lineTotal: number
    ) {
        if (expenseTypeName.expenseName.includes('Seleccione')) {
            Messages.warning('Error', 'Debe seleccionar el tipo de gasto.');
            return;
        }
        if (reference == '') {
            Messages.warning('Error', 'Debe colocar la referencia.');
            return;
        }
        if (lineTotal == 0) {
            Messages.warning('Error', 'Debe ingresar el valor.');
            return;
        }
        const newExpenseDetail: ExpenseDetailModel = {
            expenseTypeName: expenseTypeName.expenseName,
            expenseDetailId: this.index,
            expenseId: 0,
            expenseTypeId: expenseTypeName.expenseTypeId,
            reference: reference,
            lineTotal: lineTotal,
            isDeleted: false,
        };
        this.expense.detail.push(newExpenseDetail);
        this.index++;
        this.calculate();
    }

    deleteLine(itemId) {
        if (!this.isAdd) {
            this.detail.find((x) => x.expenseDetailId === itemId).isDeleted =
                true;
            this.expense.detail.find(
                (x) => x.expenseDetailId === itemId
            ).isDeleted = true;
            this.expense.detail = this.expense.detail.filter(
                (x) => x.isDeleted == false
            );
            this.calculate();
            this.index--;
        } else {
            this.expense.detail = this.expense.detail.filter(
                (x) => x.expenseDetailId != itemId
            );
            this.index--;
            this.calculate();
        }
    }

    calculate() {
        setTimeout(() => {
            const total = this.expense.detail.reduce(
                (acumulador, producto) =>
                    acumulador + Number(producto.lineTotal),
                0
            );

            this.doctotal = total;
        }, 500);
    }

    async add() {
        if (this.formExpense.valid) {
            try {
                Messages.loading('Agregando', 'Agregando registro de gasto');

                let newEntry = this.formExpense.value as ExpenseModel;
                newEntry.detail = this.expense.detail;
                newEntry.total = this.doctotal;
                let expense = await this.expenseService.addExpense(newEntry);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.ExpenseModify.emit(expense);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formExpense.valid) {
            try {
                Messages.loading('Agregando', 'Editando registro de gasto');
                let newEntry = this.formExpense.value as ExpenseModel;
                let newLine = this.expense.detail.filter(
                    (x) => x.expenseId == 0
                );
                newLine.forEach((x) => (x.expenseId = newEntry.expenseId));
                newLine.forEach((x) => (x.expenseDetailId = 0));
                this.detail = this.detail.filter((x) => x.expenseId != 0);
                //this.detail.push(...newLine);
                newEntry.detail = this.detail;
                newEntry.total = this.doctotal;

                let expense = await this.expenseService.editExpense(newEntry);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.ExpenseModify.emit(expense);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async cancel() {
        if (this.formExpense.valid) {
            let cancel = await Messages.question(
                'Cancelacion',
                'Cancelar este gasto es irreversible. ¿Seguro desea continuar?'
            );
            if (cancel) {
                try {
                    Messages.loading(
                        'Cancelando',
                        'Anulando registro de gasto'
                    );
                    let newEntry = this.formExpense.value as ExpenseModel;
                    newEntry.detail = this.detail;
                    newEntry.total = this.doctotal;
                    let expense = await this.expenseService.cancelExpense(
                        newEntry
                    );
                    Messages.closeLoading();
                    Messages.Toas('Anulado Correctamente');
                    this.ExpenseModify.emit(expense);
                    this.display = false;
                    this.index = 0;
                } catch (ex) {
                    Messages.closeLoading();
                    Messages.warning('Advertencia', ex.error.message);
                }
            }
        }
    }
}
