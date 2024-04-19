import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/service/users/role.service';

@Component({
    selector: 'role-dialog-component',
    providers: [RoleService],
    templateUrl: './role.dialog.component.html',
})
export class RoleDialogComponent implements OnInit {
    @Output() roleModify = new EventEmitter<Role[]>();
    role: Role;
    isAdd: boolean;
    formRole: FormGroup;
    loading: boolean = false;
    display: boolean = false;

    constructor( private fb: FormBuilder, private roleService: RoleService) {}

    ngOnInit() {
    }
    async _getRoles(){
        try{
            this.loading = true;
            this.role = await this.roleService.getRoleWithDetail(this.role.roleId??0);
            this._createFormBuild();
            this.loading = false;
        }
        catch(ex){
            Messages.warning("Advertencia", ex);
            this.loading = false;
        }
    }

    showDialog(role:Role, isAdd:boolean) {
        this.new();
        this.isAdd = isAdd;
        this.role = role;
        this.display = true;
        this._createFormBuild();
        this._getRoles();

    }
    _createFormBuild(){
        this.formRole = this.fb.group({
        roleId: [this.role.roleId??0],
        description: [this.role.description??"", Validators.required],
        active: [this.role.active??false],
        })
    }

    new(){
        this.role = undefined;
        this.formRole = undefined;
    }


    async add(){
        if(this.formRole.valid){
            try{
                let role = this.formRole.value as Role;
                role.detail = this.role.detail??[] as any;
                this.removeCircular(role.detail??[] as any)
                Messages.loading("Agregando", "Agregando Rol");
                let roles = await this.roleService.add(role);
                await Messages.closeLoading();
                Messages.Toas("Agregando Correctamente");
                this.roleModify.emit(roles);
                this.display = false;
            }
            catch(ex){
                await Messages.closeLoading();
                Messages.warning("Advertencia", ex);
            }
        }
    }
    async edit(){
        if(this.formRole.valid){
            try{
                let role = this.formRole.value as Role;
                role.detail = this.role.detail??[];
                this.removeCircular(role.detail??[] as any)
                Messages.loading("Editando", "Editando Rol");
                let roles = await this.roleService.edit(role);
                await Messages.closeLoading();
                Messages.Toas("Editado Correctamente");
                this.roleModify.emit(roles);
                this.display = false;
            }
            catch(ex){
               await Messages.closeLoading();
                Messages.warning("Advertencia", ex);
            }
        }
    }

    async  removeCircular(ref) {
        for (let i in ref) {
            ref[i].parent = null;
            this.removeCircular(ref[i].children);
        }
    }
}
