import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { Role } from 'src/app/models/role';
import { RoleDialogComponent } from './components/role.dialog.component';
import { RoleService } from 'src/app/service/users/role.service';

@Component({
    templateUrl: './list.roles.component.html',
    providers: [RoleService],
    styleUrls: ['./list.roles.style.scss'],
})
export class ListRolesComponent implements OnInit {
    roles: Role[];
    @ViewChild(RoleDialogComponent) RoleDialog: RoleDialogComponent;
    loading:boolean = false;
    title: string = "Listado de Roles";
    constructor(private roleService: RoleService, private auth: AuthService ) {}

    ngOnInit() {
     this._getRoles();
    }

    async _getRoles(){
      try{
        this.loading = true;
        this.roles = await this.roleService.get();
        Messages.closeLoading();
        this.loading = false;
      }
      catch(ex){
        this.loading = false;
        Messages.warning("Advertencia", ex);
      }
    }

    editRole(role: Role){
      if(!this.auth.hasPermission("btn_edit_role")){
        Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
        return;
      }
      this.RoleDialog.showDialog(role, false);
    }


    addRole(){
      if(!this.auth.hasPermission("btn_add_role")){
        Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
        return;
      }
      this.RoleDialog.showDialog(new Role(), true);
    }

    roleModify(roles: Role[]){
      this.roles = roles;
    }
}
