import { Routes } from '@angular/router';

const CrmRouting: Routes = [
  {
    path: 'objectifs/affectation',
    loadChildren: () =>
      import('./affectation/affectation.module').then((m) => m.AffectationModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'notifications/alertes',
    loadChildren: () =>
      import('./notifications/notifications.module').then((m) => m.NotificationsModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rendezvous/autorisationcr',
    loadChildren: () =>
      import('./autorisationcr/autorisationcr.module').then((m) => m.AutorisationcrModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/categorie',
    loadChildren: () =>
      import('./categorie/categorie.module').then((m) => m.CategorieModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/typemodele',
    loadChildren: () =>
      import('./typemodele/typemodele.module').then((m) => m.TypemodeleModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/modeetablissement',
    loadChildren: () =>
      import('./modeetablissement/modeetablissement.module').then((m) => m.ModeetablissementModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rendezvous/compterendu',
    loadChildren: () =>
      import('./compterendu/compterendu.module').then((m) => m.CompterenduModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'etats',
    loadChildren: () =>
      import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/indicateur',
    loadChildren: () =>
      import('./indicateur/indicateur.module').then((m) => m.IndicateurModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'notifications/mail',
    loadChildren: () =>
      import('./mail/mail.module').then((m) => m.MailModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'notifications/modelemsgalerte',
    loadChildren: () =>
      import('./modelemsgalerte/modelemsgalerte.module').then((m) => m.ModelemsgalerteModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'objectifs/objectifaffecter',
    loadChildren: () =>
      import('./objectifs/objectifs.module').then((m) => m.ObjectifsModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'objectifs/objectifatteint',
    loadChildren: () =>
      import('./objectif-atteint/objectif-atteint.module').then((m) => m.ObjectifAtteintModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'standard/parametre/periodicite',
    loadChildren: () =>
      import('./periodicite/periodicite.module').then((m) => m.PeriodiciteModule),
    data: { layout: 'dark-sidebar' },
  },
  {
    path: 'rendezvous/rdv',
    loadChildren: () =>
      import('./rdv/rdv.module').then((m) => m.RDVModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { CrmRouting };
