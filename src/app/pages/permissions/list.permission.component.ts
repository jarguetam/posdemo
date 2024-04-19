import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { PermissionService } from 'src/app/service/users/permission.service';
import { TreeNodeDto } from 'src/app/models/tree.node.dto';
import { PermissionDialogComponent } from './components/permission.dialog.component';
import { Permission } from 'src/app/models/permission';

@Component({
    templateUrl: './list.permission.component.html',
    providers: [PermissionService],
})
export class ListPermissionComponent implements OnInit {
    permissions: TreeNodeDto[];
    @ViewChild(PermissionDialogComponent)
    PermissionDialog: PermissionDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de Objetos';
    constructor(
        private permissionService: PermissionService,
        private auth: AuthService
    ) {}

    ngOnInit() {
        this._getRoles();
    }

    async _getRoles() {
        try {
            this.loading = true;
            this.permissions = await this.permissionService.get();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    editPermission(permission: TreeNodeDto) {
        if (!this.auth.hasPermission('btn_edit_permission')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar por favor solicite el acceso'
            );
            return;
        }
        var currentPermission = {
            permissionId: permission.permissionId,
            path: permission.data,
            description: permission.label,
            fatherId: permission.fatherId,
            icon: permission.icon,
            typeId: permission.typeId,
            active: permission.active,
            position: permission.positionId,
        } as Permission;
        this.PermissionDialog.showDialog(currentPermission, false);
    }

    addPermission(fatherId: number) {
        if (!this.auth.hasPermission('btn_add_permission')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar por favor solicite el acceso'
            );
            return;
        }
        var newPermission = {
            permissionId: 0,
            path: '',
            description: '',
            fatherId: fatherId,
            icon: '',
            typeId: 0,
            active: true,
        } as Permission;
        this.PermissionDialog.showDialog(newPermission, true);
    }

    permissionModify(permissions: TreeNodeDto[]) {
        this.permissions = permissions;
    }
}
