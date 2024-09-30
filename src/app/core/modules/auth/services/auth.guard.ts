import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // debugger;
    const currentUser = this.authService.currentUserValue;
    // console.log("User === ", currentUser);


    return true;
    /*if (currentUser) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;*/
  }
}
