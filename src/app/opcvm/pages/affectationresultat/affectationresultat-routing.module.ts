import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Affectationresultat } from './affectationresultat';
import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';
import { Miseenaffectation } from './miseenaffectation/miseenaffectation';
import { Decisiondistribution } from './decisiondistribution/decisiondistribution';
import { DecisiondistributionAddEdit } from './decisiondistribution-add-edit/decisiondistribution-add-edit';
import { Phasedetachement } from './phasedetachement/phasedetachement';
import { Detachementeffectue } from './detachementeffectue/detachementeffectue';
import { Phasepaiement } from './phasepaiement/phasepaiement';
import { Paiementdividende } from './paiementdividende/paiementdividende';
// import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';

const routes: Routes = [
  {
    path: '',
    component: Affectationresultat,
    children: [
      { path: 'tableau', component: Tableauaffectationresultat, } ,
      { path: 'miseenaffectation', component: Miseenaffectation, } ,
      { path: 'phasedetachementcoupon', component: Phasedetachement, } ,
      { path: 'phasepaiement', component: Phasepaiement, } ,
      { path: 'avispaiement', component: Paiementdividende, } ,
      { path: 'detachementeffectue', component: Detachementeffectue, } ,
      { path: 'decisiondistribution', component: Decisiondistribution, } ,
      { path: 'decisiondistribution/new', component: DecisiondistributionAddEdit, } ,
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
