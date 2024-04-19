import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTransferListComponent } from './inventory-transfer-list/inventory-transfer-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InventoryTransferListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryTransferRoutingModule { }
