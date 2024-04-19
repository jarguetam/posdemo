import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPurchaseListComponent } from './orders-purchase-list/orders-purchase-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OrdersPurchaseListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
