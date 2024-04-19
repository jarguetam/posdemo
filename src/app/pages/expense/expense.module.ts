import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseTypeListComponent } from './expense-type/expense-type-list/expense-type-list.component';
import { ExpenseTypeDialogComponent } from './expense-type/expense-type-dialog/expense-type-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Components2AppModule } from 'src/app/components.modules-2';
import { ExpenseDialogComponent } from './expense/expense-dialog/expense-dialog.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { LiquidationListComponent } from './liquidation/liquidation-list/liquidation-list.component';
import { LiquidationDialogComponent } from './liquidation/liquidation-dialog/liquidation-dialog.component';
import { ButtonModule } from 'primeng/button';
import { InvoiceModule } from '../purchase/invoice/invoice.module';
import { AppModule } from 'src/app/app.module';

@NgModule({
  declarations: [
    ExpenseTypeListComponent,
    ExpenseTypeDialogComponent,
    ExpenseListComponent,
    ExpenseDialogComponent,
    

  ],
  imports: [
    CommonModule,
    Components2AppModule,
    ReactiveFormsModule,
    ExpenseRoutingModule
  ]
})
export class ExpenseModule { }
