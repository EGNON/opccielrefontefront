import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConsultationEcrituresComponent} from "./consultation-ecritures/consultation-ecritures.component";
import {ComptabiliteComponent} from "./comptabilite.component";
import {TransfertPartsComponent} from "./transfert-parts/transfert-parts.component";
import {TransfertPartsListComponent} from "./transfert-parts-list/transfert-parts-list.component";
import {ConstatationChargesListComponent} from "./constatation-charges-list/constatation-charges-list.component";
import {ConstatationChargesComponent} from "./constatation-charges/constatation-charges.component";
import {PaiementCommissionComponent} from "./paiement-commission/paiement-commission.component";
import {PaiementCommissionListComponent} from "./paiement-commission-list/paiement-commission-list.component";

const routes: Routes = [
  {
    path: '',
    component: ComptabiliteComponent,
    children: [
      { path: 'consultation/ecritures', component: ConsultationEcrituresComponent},
      { path: 'constatation/charges/liste', component: ConstatationChargesListComponent},
      { path: 'constatation/charges', component: ConstatationChargesComponent},
      { path: 'transfert/parts/liste', component: TransfertPartsListComponent},
      { path: 'paiement/commission', component: PaiementCommissionComponent},
      { path: 'paiement/commission/liste', component: PaiementCommissionListComponent},
      { path: 'transfert/parts', component: TransfertPartsComponent},
      { path: 'consultation', redirectTo: 'consultation/ecritures', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteRoutingModule { }
