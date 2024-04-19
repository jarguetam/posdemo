import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostRevaluationListComponent } from './cost-revaluation-list/cost-revaluation-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CostRevaluationListComponent,
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostRevaluationRoutingModule { }
