import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryReturnListComponent } from './inventory-return-list/inventory-return-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InventoryReturnListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryReturnRoutingModule { }
