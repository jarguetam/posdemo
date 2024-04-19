import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerRegionListComponent } from './seller-region-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SellerRegionListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRegionListRoutingModule { }
