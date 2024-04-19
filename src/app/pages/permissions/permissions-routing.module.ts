import { ListPermissionComponent } from './list.permission.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'listado-permisos',
                component: ListPermissionComponent,
            },
            { path: '**', redirectTo: 'listado-permisos' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
