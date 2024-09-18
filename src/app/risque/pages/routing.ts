import { Routes } from '@angular/router';

const RisqueRouting: Routes = [
  {
    path: 'etats',
    loadChildren: () =>
      import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { RisqueRouting };
