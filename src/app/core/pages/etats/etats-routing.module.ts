import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "./etats.component";
import {PointtresorerieComponent} from "./pointtresorerie/pointtresorerie.component";
import {PointtresorerieetatComponent} from "./pointtresorerieetat/pointtresorerieetat.component";
import {ProcedurecomptableComponent} from "./procedurecomptable/procedurecomptable.component";
import {ReleveactionnaireComponent} from "./releveactionnaire/releveactionnaire.component";
import {FicheclientComponent} from "./ficheclient/ficheclient.component";
import {EtatsuiviactionnaireComponent} from "./etatsuiviactionnaire/etatsuiviactionnaire.component";
import {EtatsuiviclientComponent} from "./etatsuiviclient/etatsuiviclient.component";

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'pointtresorerie', component: PointtresorerieetatComponent, },
      { path: 'procedurecomptable', component: ProcedurecomptableComponent, },
      { path: 'releveactionnaire', component: ReleveactionnaireComponent, },
      { path: 'ficheclient', component: FicheclientComponent, },
      { path: 'etatsuiviactionnaire', component: EtatsuiviactionnaireComponent, },
      { path: 'etatsuiviclient', component: EtatsuiviclientComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'formejuridique', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }
