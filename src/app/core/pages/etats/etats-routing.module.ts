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
import { Performanceportefeuilleactionnaire } from './performanceportefeuilleactionnaire/performanceportefeuilleactionnaire';
import { Etatfraisfonctionnement } from './etatfraisfonctionnement/etatfraisfonctionnement';
import { Evolutionvl } from './evolutionvl/evolutionvl';
import { Pointsouscriptionrachat } from './pointsouscriptionrachat/pointsouscriptionrachat';
import { Pointrachat } from './pointrachat/pointrachat';
import { Pointrepartitionportefeuille } from './pointrepartitionportefeuille/pointrepartitionportefeuille';
import { Evolutionactifnet } from './evolutionactifnet/evolutionactifnet';
import { PortefeuilleactionnaireF1 } from './portefeuilleactionnaire-f1/portefeuilleactionnaire-f1';

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'pointtresorerie', component: PointtresorerieetatComponent, },
      { path: 'procedurecomptable', component: ProcedurecomptableComponent, },
      { path: 'releveactionnaire', component: ReleveactionnaireComponent, },
      { path: 'portefeuilleactionnairef1', component: PortefeuilleactionnaireF1, },
      { path: 'ficheclient', component: FicheclientComponent, },
      { path: 'etatsuiviactionnaire', component: EtatsuiviactionnaireComponent, },
      { path: 'etatsuiviclient', component: EtatsuiviclientComponent, },
      { path: 'etatfraisfonctionnement', component: Etatfraisfonctionnement, },
      { path: 'performanceportefeuilleactionnaire', component: Performanceportefeuilleactionnaire, },
      { path: 'evolutionvl', component: Evolutionvl, },
      { path: 'pointsouscription', component: Pointsouscriptionrachat, },
      { path: 'pointrachat', component: Pointrachat, },
      { path: 'pointrepartitionportefeuille', component: Pointrepartitionportefeuille, },
      { path: 'evolutionactifnet', component: Evolutionactifnet, },
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
