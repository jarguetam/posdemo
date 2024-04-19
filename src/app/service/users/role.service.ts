import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from '../../models/role';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoleService {

    constructor(private http: HttpClient) { }

    async get() {
      return await firstValueFrom(this.http.get<Role[]>(`${environment.uriLogistic}/role`));
    }
    async getRoleWithDetail(roleId: number) {
      return await firstValueFrom(this.http.get<Role>(`${environment.uriLogistic}/role/RoleWithDetail/${roleId}`));
    }
    async add(role:Role) {
      return await firstValueFrom(this.http.post<Role[]>(`${environment.uriLogistic}/role`, role));
    }
    async edit(role:Role) {
      return await firstValueFrom(this.http.put<Role[]>(`${environment.uriLogistic}/role`, role));
    }
}
