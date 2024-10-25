import { Routes } from '@angular/router';

const OpcvmRouting: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'etats',
    loadChildren: () =>
      import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/actionnaireopcvm',
    loadChildren: () =>
      import('./actionnaireopcvm/actionnaireopcvm.module').then((m) => m.ActionnaireopcvmModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/profilopc',
    loadChildren: () =>
      import('./profilcommissionsousrach/profilcommissionsousrach.module').then((m) => m.ProfilcommissionsousrachModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rachat/intentionrachat',
    loadChildren: () =>
      import('./intentionrachat/intentionrachat.module').then((m) => m.IntentionrachatModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/tarificationactionnaire',
    loadChildren: () =>
      import('./actionnairecommission/actionnairecommission.module').then((m) => m.ActionnairecommissionModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/tarification',
    loadChildren: () =>
      import('./tarificationordinaire/tarificationordinaire.module').then((m) => m.TarificationordinaireModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/chargeaetaler',
    loadChildren: () =>
      import('./charge/charge.module').then((m) => m.ChargeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'souscription/importationdepot',
    loadChildren: () => import('./importationdepot/importationdepot.module').then((m) => m.ImportationdepotModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'souscription/depotsouscription',
    loadChildren: () => import('./depotsouscription/depotsouscription.module').then((m) => m.DepotsouscriptionModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { OpcvmRouting };
