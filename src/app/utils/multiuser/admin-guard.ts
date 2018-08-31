import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {Role, User} from '../../models/user';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private location: Location,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('user')) {
      const user: User = JSON.parse(localStorage.getItem('user'));
      if (user.role === Role.Admin) {
        return true;
      }
      this.location.back();
      return false;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
