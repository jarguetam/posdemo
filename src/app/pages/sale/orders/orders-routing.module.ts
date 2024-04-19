import { OrdersSaleListComponent } from './orders-sale-list/orders-sale-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OrdersSaleListComponent,
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
