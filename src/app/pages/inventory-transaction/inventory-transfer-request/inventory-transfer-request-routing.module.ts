import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTransferRequestListComponent } from './inventory-transfer-request-list/inventory-transfer-request-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InventoryTransferRequestListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryTransferRequestRoutingModule { }
