import { InvoiceSaleListComponent } from './invoice-sale-list/invoice-sale-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceSaleComponent } from './invoice-sale/invoice-sale.component';
import { InvoiceSaleDialogComponent } from './invoice-sale-dialog/invoice-sale-dialog.component';
import { CustomerBalanceSaleComponent } from '../customer-balance-sale/customer-balance-sale.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InvoiceSaleListComponent,
            },
            {
                path: 'factura',
                component: InvoiceSaleComponent,
            },
            {
                path: 'factura-movil',
                component: InvoiceSaleDialogComponent,
            },
            {
                path: 'customer-balance',
                component: CustomerBalanceSaleComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
