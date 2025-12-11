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
    path: 'circulaire8',
    loadChildren: () =>
      import('./circulaire8/circulaire8.module').then((m) => m.Circulaire8Module),
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
    path: 'rachat/paiementrachat',
    loadChildren: () =>
      import('./paiementrachat/paiementrachat.module').then((m) => m.PaiementrachatModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rachat/avisrachat',
    loadChildren: () =>
      import('./avisrachat/avisrachat.module').then((m) => m.AvisrachatModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rachat/verificationintentionniveau1',
    loadChildren: () =>
      import('./verificationniveau1/verificationniveau1.module').then((m) => m.Verificationniveau1Module),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rachat/verificationintentionniveau2',
    loadChildren: () =>
      import('./verificationniveau2/verificationniveau2.module').then((m) => m.Verificationniveau2Module),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rachat/generationrachat',
    loadChildren: () =>
      import('./generationrachat/generationrachat.module').then((m) => m.GenerationrachatModule),
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
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./depotsouscription/depotsouscription.module').then((m) => m.DepotsouscriptionModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'souscriptiontransferttitre',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./souscription-transfert-titre/souscription-transfert-titre-module').then((m) => m.SouscriptionTransfertTitreModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'comptabilite',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./comptabilite/comptabilite.module').then((m) => m.ComptabiliteModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'vde',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./vde/vde.module').then((m) => m.VDEModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'cloture',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./cloture/cloture.module').then((m) => m.ClotureModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'ordre',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./ordre/ordre.module').then((m) => m.OrdreModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'evenementsurvaleur/operationdetachement',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./operationdetachement/operationdetachement.module').then((m) => m.OperationdetachementModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'avisevenementsurvaleur',
    // canActivate: [OpcvmAuthGuard],
    loadChildren: () => import('./operationevenementsurvaleur/operationevenementsurvaleur.module').then((m) => m.OperationevenementsurvaleurModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { OpcvmRouting };
