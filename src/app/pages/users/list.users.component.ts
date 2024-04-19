import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api'
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/users/user.service';
import { Messages } from 'src/app/helpers/messages';
import { UserDialogComponent } from './components/user.dialog.component';
import { AuthService } from 'src/app/service/users/auth.service';

@Component({
    templateUrl: './list.users.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['./list.users.style.scss'],
})
export class ListUsersComponent implements OnInit {
    users: User[];
    @ViewChild(UserDialogComponent) UserDialog: UserDialogComponent;
    loading:boolean = false;
    title: string = "Listado de Usuarios";
    constructor(private userService: UserService, private auth: AuthService ) {}

    ngOnInit() {
     this._getUsers();
    }

    async _getUsers(){
      try{
        this.loading = true;
        this.users = await this.userService.get();
        Messages.closeLoading();
        this.loading = false;
      }
      catch(ex){
        this.loading = false;
        Messages.warning("Advertencia", ex);
      }
    }

    editUser(user: User){
      if(!this.auth.hasPermission("btn_edit_user")){
        Messages.warning("No tiene acceso", "No puede editar por favor solicite el acceso")
        return;
      }
      this.UserDialog.showDialog(user, false);
    }
    addUser(){
      if(!this.auth.hasPermission("btn_add_user")){
        Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
        return;
      }
      this.UserDialog.showDialog(new User(), true);
    }

    userModify(users: User[]){
      this.users = users;
    }
}
