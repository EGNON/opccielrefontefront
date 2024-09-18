import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "./etats.component";
import {RdvPrintComponent} from "./rdv-print/rdv-print.component";
import {ProspectPrintComponent} from "./prospect-print/prospect-print.component";
import {ClientPrintComponent} from "./client-print/client-print.component";
import {CompterenduPrintComponent} from "./compterendu-print/compterendu-print.component";
import {ProduitsouscritPrintComponent} from "./produitsouscrit-print/produitsouscrit-print.component";
import {FichekycPrintComponent} from "./fichekyc-print/fichekyc-print.component";
import {ClientnayantinvestiComponent} from "./clientnayantinvesti/clientnayantinvesti.component";
import {ObjectifPrintComponent} from "./objectif-print/objectif-print.component";
import {TestPrintComponent} from "./test-print/test-print.component";
import {TestPrint2Component} from "./test-print-2/test-print-2.component";

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'rdv/liste', component: RdvPrintComponent, },
      { path: 'prospect/liste', component: ProspectPrintComponent, },
      { path: 'client/liste', component: ClientPrintComponent, },
      { path: 'cr/liste', component: CompterenduPrintComponent, },
      { path: 'produitsouscrit/liste', component: ProduitsouscritPrintComponent, },
      { path: 'client/fichekyc', component: FichekycPrintComponent, },
      { path: 'client/nayantpasinvesti', component: ClientnayantinvestiComponent, },
      { path: 'objectif/liste', component: ObjectifPrintComponent, },
      { path: 'test/print', component: TestPrintComponent, },
      { path: 'test/print22', component: TestPrint2Component, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtatsRoutingModule {}
