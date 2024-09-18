import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "./etats.component";
import {
  DepotsuperieuracinqmillionsComponent
} from "./depotsuperieuracinqmillions/depotsuperieuracinqmillions.component";
import {DepotespecerecensesuranneeComponent} from "./depotespecerecensesurannee/depotespecerecensesurannee.component";
import {DepotsuperieuradixmillionsComponent} from "./depotsuperieuradixmillions/depotsuperieuradixmillions.component";
import {
  OperationnouvellerelationsupadixmillionsComponent
} from "./operationnouvellerelationsupadixmillions/operationnouvellerelationsupadixmillions.component";
import {RecensementopeffectueesComponent} from "./recensementopeffectuees/recensementopeffectuees.component";
import {
  TransactionSuspectInhabituelComponent
} from "./transaction-suspect-inhabituel/transaction-suspect-inhabituel.component";
import {SuiviClientSanctionComponent} from "./suivi-client-sanction/suivi-client-sanction.component";
import {RegistreConfidentielComponent} from "./registre-confidentiel/registre-confidentiel.component";
import {
  OperationconditioninhabituelleComponent
} from "./operationconditioninhabituelle/operationconditioninhabituelle.component";
import {OperationconditionnormaleComponent} from "./operationconditionnormale/operationconditionnormale.component";

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'depot-superieur-a-cinq-millions/liste', component: DepotsuperieuracinqmillionsComponent, },
      { path: 'depot-sur-annee-superieur-ou-egal-a-dix-millions/liste', component: DepotsuperieuradixmillionsComponent, },
      { path: 'operation-constituant-de-nouvelle-relation-superieur-ou-egal-a-dix-millions/liste', component: OperationnouvellerelationsupadixmillionsComponent, },
      { path: 'depot-espece-sur-annee/liste', component: DepotespecerecensesuranneeComponent, },
      { path: 'recensement/operation-client/liste', component: RecensementopeffectueesComponent, },
      { path: 'identification/operation-suspecte/inhabituelle/liste', component: TransactionSuspectInhabituelComponent, },
      { path: 'sanction/suivi-client/liste', component: SuiviClientSanctionComponent, },
      { path: 'registre/confidentiel', component: RegistreConfidentielComponent, },
      { path: 'operation-effectuee-condition-inhabituelle-superieur-ou-egal-a-dix-millions/liste', component: OperationconditioninhabituelleComponent, },
      { path: 'operation-effectuee-condition-normale-superieur-ou-egal-a-cinquante-millions/liste', component: OperationconditionnormaleComponent, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtatsRoutingModule {}
