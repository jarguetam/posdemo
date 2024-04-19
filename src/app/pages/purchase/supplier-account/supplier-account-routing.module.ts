import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierAccountListComponent } from './supplier-account-list/supplier-account-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SupplierAccountListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierAccountRoutingModule { }
