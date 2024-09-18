import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'etats',
    loadChildren: () =>
      import('./etats/etats.module').then((m) => m.EtatsModule),
    data: { layout: 'dark-sidebar' },
  },
];

export { Routing };
