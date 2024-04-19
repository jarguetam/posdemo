import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permission } from '../../models/permission';
import { TreeNodeDto } from '../../models/tree.node.dto';
import { TypePermission } from '../../models/type.permission';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PermissionService {

    constructor(private http: HttpClient) { }

    async get() {
      return await firstValueFrom(this.http.get<TreeNodeDto[]>(`${environment.uriLogistic}/Permission`));
    }
    async getTypePermission() {
      return await firstValueFrom(this.http.get<TypePermission[]>(`${environment.uriLogistic}/Permission/GetTypePermission`));
    }

    async getById(permissionId){
      return await firstValueFrom(this.http.get<Permission>(`${environment.uriLogistic}/Permission/ById/${permissionId}`));
    }

    async add(permission:Permission) {
      return await firstValueFrom(this.http.post<TreeNodeDto[]>(`${environment.uriLogistic}/Permission`, permission));
    }
    async edit(permission:Permission) {
      return await firstValueFrom(this.http.put<TreeNodeDto[]>(`${environment.uriLogistic}/Permission`, permission));
    }
}
