import { Routes } from '@angular/router';

const LabRouting: Routes = [
  {
    path: 'standard/parametre/pays',
    loadChildren: () =>
      import('./pays/pays.module').then((m) => m.PaysModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/morale/politiquementexpose',
    loadChildren: () =>
      import('./personne-morale-expose/personne-morale-expose.module').then((m) => m.PersonneMoraleExposeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/morale/juge',
    loadChildren: () =>
      import('./personne-morale-juge/personne-morale-juge.module').then((m) => m.PersonneMoraleJugeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/physique/politiquementexpose',
    loadChildren: () =>
      import('./personne-physique/personne-physique.module').then((m) => m.PersonnePhysiqueModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/physique/juge',
    loadChildren: () =>
      import('./personne-physique-juge/personne-physique-juge.module').then((m) => m.PersonnePhysiqueJugeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/physique/sanctionnee',
    loadChildren: () =>
      import('./personnephysique-sanctionnee/personnephysique-sanctionnee.module').then((m) => m.PersonnephysiqueSanctionneeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/personne/morale/sanctionnee',
    loadChildren: () =>
      import('./personnemorale-sanctionnee/personnemorale-sanctionnee.module').then((m) => m.PersonnemoraleSanctionneeModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'geldegel',
    loadChildren: () =>
      import('./geldegel/geldegel.module').then((m) => m.GeldegelModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'notifications/alertes',
    loadChildren: () =>
      import('./criterealerte/criterealerte.module').then((m) => m.CriterealerteModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transaction/transaction.module').then((m) => m.TransactionModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'etats',
    loadChildren: () =>
      import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { LabRouting };
