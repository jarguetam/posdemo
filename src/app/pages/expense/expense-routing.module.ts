import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTypeListComponent } from './expense-type/expense-type-list/expense-type-list.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { LiquidationListComponent } from './liquidation/liquidation-list/liquidation-list.component';
import { LiquidationMoneyComponent } from './liquidation-money/liquidation-money.component';
import { LiquidationMoneyListComponent } from './liquidation-money/liquidation-money-list/liquidation-money-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'articulos-gastos',
                component: ExpenseTypeListComponent,
            },
            {
                path: 'registrar-gasto',
                component: ExpenseListComponent,
            },
            {
                path: 'liquidaciones',
                component: LiquidationListComponent,
            },
            {
                path: 'liquidacion-dinero',
                component: LiquidationMoneyComponent,
            },
            {
                path: 'liquidacion-dinero-listado',
                component: LiquidationMoneyListComponent,
            },
            {
                path: '',
                redirectTo: 'ingreso',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
