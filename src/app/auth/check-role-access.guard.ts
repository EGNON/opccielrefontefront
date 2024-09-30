import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../core/modules/auth";

export const checkRoleAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return true;
  if(!route.data.role)
    return false;
  return authService.isGrantedRole(route.data.role.toString());
};
