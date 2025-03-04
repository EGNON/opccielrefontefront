import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from "../../core/modules/auth";
import {LocalService} from "../../services/local.service";

@Injectable({ providedIn: 'root' })
export class OpcvmAuthGuard  {
  constructor(private authService: AuthService,
              private localStore: LocalService,) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentOpcvm = this.localStore.getData("currentOpcvm");
    console.log("OPCVM CONNECTE === ", currentOpcvm != null);
    console.log("ROUTE === ", route);
    return currentOpcvm != null;
  }
}
