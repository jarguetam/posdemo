import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Messages } from '../helpers/messages';
import { AuthService } from '../service/users/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private auth: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.auth.UserValue;
        if (currentUser) {
            let exists = currentUser.permissions.filter(x=> x.path == `/${route.routeConfig.path}`);
            if(exists.length ==0)
            {
                // this.router.navigate(['/pages/access']);
                Messages.Toas("No tiene acceso", 'warning')
                return false;
             }

            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
