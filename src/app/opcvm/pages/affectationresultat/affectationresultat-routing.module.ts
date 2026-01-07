import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Affectationresultat } from './affectationresultat';
import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';
// import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';

const routes: Routes = [
  {
    path: '',
    component: Affectationresultat,
    children: [
      { path: 'tableau', component: Tableauaffectationresultat, } ,
      { path: 'affectation_resultat', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffectationResultatRoutingModule { }
