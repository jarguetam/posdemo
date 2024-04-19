import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioTransactionTypeListComponent } from './inventario-transaction-type-list/inventario-transaction-type-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InventarioTransactionTypeListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryTransactionTypeRoutingModule { }
