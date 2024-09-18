import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../core/modules/auth";

export const checkPermissionAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // console.log("route.data.role");
  if(!route.data.role)
    return false;
  const permissions = authService.getUserPermissionsOnRole();
  // console.log("Child activation = ", permissions.length > 0);
  return permissions.length > 0;
};
