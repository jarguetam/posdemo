import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesPaymentListComponent } from './sales-payment-list/sales-payment-list.component';
import { SalesPaymentComponent } from './sales-payment/sales-payment.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SalesPaymentListComponent,
            },
            {
                path: 'pagos',
                component: SalesPaymentComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPaymentRoutingModule { }
