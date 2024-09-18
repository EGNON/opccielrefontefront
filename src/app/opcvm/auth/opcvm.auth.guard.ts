import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from "../../core/modules/auth";

@Injectable({ providedIn: 'root' })
export class OpcvmAuthGuard  {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentOpcvm = this.authService.currentOpcvmValue;
    console.log("OPCVM CONNECTE === ", currentOpcvm);
    if (currentOpcvm) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    //this.authService.logout();
    return false;
  }
}
