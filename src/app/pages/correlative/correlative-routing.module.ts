import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCorrelativeComponent } from './list.correlative.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListCorrelativeComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrelativeRoutingModule { }
