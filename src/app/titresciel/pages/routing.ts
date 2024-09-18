import { Routes } from '@angular/router';
import {checkPermissionAccessGuard} from "../../auth/check-permission-access.guard";
import {checkRoleAccessGuard} from "../../auth/check-role-access.guard";

const TitrescielRouting: Routes = [
  {
    path: 'standard/parametre/instrumentfinancier/titres',
    canActivate: [checkRoleAccessGuard, checkPermissionAccessGuard],
    // canActivateChild: [checkPermissionAccessGuard],
    loadChildren: () => import('./titres/titres.module').then((m) => m.TitresModule),
    data: { layout: 'dark-sidebar', role: 'ROLE_DEGRE' },
  },
];

export { TitrescielRouting };
