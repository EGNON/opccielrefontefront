import { Routes } from '@angular/router';
import {OpcvmAuthGuard} from "./opcvm/auth/opcvm.auth.guard";

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./template/pages/builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'app',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'crm',
    loadChildren: () => import('./crm/crm.module').then((m) => m.CrmModule),
    // canActivate: [false]
  },
  {
    path: 'lab',
    loadChildren: () => import('./lab/lab.module').then((m) => m.LabModule),
    // canActivate: [false]
  },
  {
    path: 'risque',
    loadChildren: () => import('./risque/risque.module').then((m) => m.RisqueModule),
    // canActivate: [false]
  },
  {
    path: 'opcvm',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./opcvm/opcvm.module').then((m) => m.OpcvmModule),
  },
  {
    path: 'oif',
    loadChildren: () => import('./oif/oif.module').then((m) => m.OifModule),
    // canActivate: [false]
  },
  {
    path: 'titresciel',
    loadChildren: () => import('./titresciel/titresciel.module').then((m) => m.TitrescielModule),
    // canActivate: [false]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
