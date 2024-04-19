import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { Permission } from 'src/app/models/permission';
import { TreeNodeDto } from 'src/app/models/tree.node.dto';
import { TypePermission } from 'src/app/models/type.permission';
import { PermissionService } from 'src/app/service/users/permission.service';
import { RoleService } from 'src/app/service/users/role.service';

@Component({
    selector: 'permission-dialog-component',
    providers: [RoleService],
    templateUrl: './permission.dialog.component.html',
})
export class PermissionDialogComponent implements OnInit {
    @Output() permissionModify = new EventEmitter<TreeNodeDto[]>();
    permission: Permission;
    typePermissions: TypePermission[] = [];

    isAdd: boolean;
    formPermission: FormGroup;
    loading: boolean = false;
    display: boolean = false;

    constructor( private fb: FormBuilder, private permissionService: PermissionService) {}

    ngOnInit() {
    }
    async _getRoles(){
        try{
            this.loading = true;
            this.typePermissions = await this.permissionService.getTypePermission();
            this.typePermissions.unshift({typeId: 0, description:"Seleccione un Tipo"});
            this._createFormBuild();
            this.loading = false;
        }
        catch(ex){
            Messages.warning("Advertencia", ex);
            this.loading = false;
        }
    }

    showDialog(permission:Permission, isAdd:boolean) {
        this.new();
        this.isAdd = isAdd;
        this.permission = permission;
        this.display = true;
        this._createFormBuild();
        this._getRoles();

    }
    _createFormBuild(){
        this.formPermission = this.fb.group({
        permissionId: [this.permission.permissionId??0],
        description: [this.permission.description??"", Validators.required],
        path: [this.permission.path??"", Validators.required],
        fatherId: [this.permission.fatherId??0, Validators.required],
        icon: [this.permission.icon??"", Validators.required],
        typeId: [this.permission.typeId??0,  Validators.compose([
            Validators.required, Validators.min(1)
        ])],
        position: [this.permission.position??0, Validators.required],
        active: [this.permission.active??false],
        })
    }

    new(){
        this.permission = undefined;
        this.formPermission = undefined;
    }


    async add(){
        if(this.formPermission.valid){
            try{
                let permission = this.formPermission.value as Permission;
                Messages.loading("Agregando", "Agregando Permiso");
                let permissions = await this.permissionService.add(permission);
                await Messages.closeLoading();
                Messages.Toas("Agregando Correctamente");
                this.permissionModify.emit(permissions);
                this.display = false;
            }
            catch(ex){
                await Messages.closeLoading();
                Messages.warning("Advertencia", ex);
            }
        }
    }
    async edit(){
        if(this.formPermission.valid){
            try{
                let permission = this.formPermission.value as Permission;
                Messages.loading("Editando", "Editando Permiso");
                let roles = await this.permissionService.edit(permission);
                await Messages.closeLoading();
                Messages.Toas("Editado Correctamente");
                this.permissionModify.emit(roles);
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
