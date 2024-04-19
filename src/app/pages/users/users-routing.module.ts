import { ListUsersComponent } from './list.users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'listado-usuarios',
                component: ListUsersComponent,
            },
            { path: '**', redirectTo: 'listado-usuarios' },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
