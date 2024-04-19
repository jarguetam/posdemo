import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from '../../models/role';
import { Theme } from '../../models/theme';
import { User } from '../../models/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    async get() {
      return await firstValueFrom(this.http.get<User[]>(`${environment.uriLogistic}/user`));
    }

   async  add(user:User) {
      return await firstValueFrom(this.http.post<User[]>(`${environment.uriLogistic}/user`, user));
    }
    async edit(user:User) {
      return await firstValueFrom(this.http.put<User[]>(`${environment.uriLogistic}/user`, user));
    }
    async getRoles() {
      return await firstValueFrom(this.http.get<Role[]>(`${environment.uriLogistic}/role/ActiveOnly`));
    }
    async getThemes() {
      return await firstValueFrom(this.http.get<Theme[]>(`${environment.uriLogistic}/user/Themes`));
    }
}
