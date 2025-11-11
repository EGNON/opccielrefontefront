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
import {
  ListeverificationecritureV1Component
} from "./listeverificationecriture-v1/listeverificationecriture-v1.component";
import {
  ListeverificationecritureV2Component
} from "./listeverificationecriture-v2/listeverificationecriture-v2.component";
import {PaiementChargesComponent} from "./paiement-charges/paiement-charges.component";
import {RegulecartsoldeListComponent} from "./regulecartsolde-list/regulecartsolde-list.component";
import {RegulecartsoldeAddEditComponent} from "./regulecartsolde-add-edit/regulecartsolde-add-edit.component";
import {
  PaiementCommissionInvestissementListComponent
} from "./paiement-commission-investissement-list/paiement-commission-investissement-list.component";
import {
  PaiementCommissionInvestissementAddEditComponent
} from "./paiement-commission-investissement-add-edit/paiement-commission-investissement-add-edit.component";
import {EcritureManuelComponent} from "./ecriture-manuel/ecriture-manuel.component";
import {OperationdetachementdroitComponent} from "./operationdetachementdroit/operationdetachementdroit.component";
import { ExerciceList } from './exercice-list/exercice-list';
import { ExerciceAddEdit } from './exercice-add-edit/exercice-add-edit';

const routes: Routes = [
  {
    path: '',
    component: ComptabiliteComponent,
    children: [
      { path: 'consultation/ecritures', component: ConsultationEcrituresComponent},
      { path: 'ecritures/manuelle', component: EcritureManuelComponent},
      { path: 'operationdetachementdroit/liste', component: OperationdetachementdroitComponent},
      { path: 'verification/niveau1', component: ListeverificationecritureV1Component},
      { path: 'verification/niveau2', component: ListeverificationecritureV2Component},
      { path: 'constatation/charges/liste', component: ConstatationChargesListComponent},
      { path: 'paiement/charges/liste', component: PaiementChargesComponent},
      { path: 'constatation/charges', component: ConstatationChargesComponent},
      { path: 'transfert/parts/liste', component: TransfertPartsListComponent},
      { path: 'paiement/commission', component: PaiementCommissionComponent},
      { path: 'paiement/commission/liste', component: PaiementCommissionListComponent},
      { path: 'transfert/parts', component: TransfertPartsComponent},
      { path: 'regulecartsolde/liste', component: RegulecartsoldeListComponent},
      { path: 'retrocessioncommissioninvestissement/liste', component: PaiementCommissionInvestissementListComponent},
      { path: 'retrocessioncommissioninvestissement/liste/new', component: PaiementCommissionInvestissementAddEditComponent},
      { path: 'regulecartsolde/liste/new', component: RegulecartsoldeAddEditComponent},
      { path: 'regulecartsolde/liste/edit/:id', component: RegulecartsoldeAddEditComponent},
      { path: 'consultation', redirectTo: 'consultation/ecritures', pathMatch: 'full' },
      { path: 'exercice/liste', component: ExerciceList},
      { path: 'exercice/liste/new', component: ExerciceAddEdit},
      { path: 'exercice/liste/edit/:id/:id2', component: ExerciceAddEdit},
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteRoutingModule { }
