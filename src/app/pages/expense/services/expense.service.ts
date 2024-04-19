import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExpenseTypeModel } from '../models/expense-type-model';
import { environment } from 'src/environments/environment';
import { ExpenseModel } from '../models/expense-model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

    constructor(private http: HttpClient) {}

    async getExpenseType() {
        return await firstValueFrom(
            this.http.get<ExpenseTypeModel[]>(
                `${environment.uriLogistic}/api/Expenses/ExpenseType`
            )
        );
    }

    async addExpenseType(request: ExpenseTypeModel) {
        return await firstValueFrom(
            this.http.post<ExpenseTypeModel[]>(
                `${environment.uriLogistic}/api/Expenses/AddExpenseType`,
                request
            )
        );
    }

    async editExpenseType(request: ExpenseTypeModel) {
        return await firstValueFrom(
            this.http.put<ExpenseTypeModel[]>(
                `${environment.uriLogistic}/api/Expenses/EditExpenseType`,
                request
            )
        );
    }

    //Expense
    async getExpense() {
        return await firstValueFrom(
            this.http.get<ExpenseModel[]>(
                `${environment.uriLogistic}/api/Expenses/Expense`
            )
        );
    }

    async getExpenseByDate(from: string, to: string) {
        return await firstValueFrom(
            this.http.get<ExpenseModel[]>(
                `${environment.uriLogistic}/api/Expenses/GetExpenseByDate/${from}/${to}`
            )
        );
    }

    async addExpense(request: ExpenseModel) {
        return await firstValueFrom(
            this.http.post<ExpenseModel[]>(
                `${environment.uriLogistic}/api/Expenses/AddExpense`,
                request
            )
        );
    }

    async editExpense(request: ExpenseModel) {
        return await firstValueFrom(
            this.http.put<ExpenseModel[]>(
                `${environment.uriLogistic}/api/Expenses/UpdateExpense`,
                request
            )
        );
    }

    async cancelExpense(request: ExpenseModel) {
        return await firstValueFrom(
            this.http.put<ExpenseModel[]>(
                `${environment.uriLogistic}/api/Expenses/CancelExpense`,
                request
            )
        );
    }
}
