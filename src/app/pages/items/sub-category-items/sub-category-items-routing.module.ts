import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubCategoryItemsListComponent } from './sub-category-items-list/sub-category-items-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SubCategoryItemsListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoryItemsRoutingModule { }
