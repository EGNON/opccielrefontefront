import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepotsouscriptionComponent} from "./depotsouscription.component";
import {DepotsouscriptionListComponent} from "./depotsouscription-list/depotsouscription-list.component";
import {DepotsouscriptionAddEditComponent} from "./depotsouscription-add-edit/depotsouscription-add-edit.component";
import {DepotsouscriptionGenerateComponent} from "./depotsouscription-generate/depotsouscription-generate.component";
import {
  VerifDepotsouscriptionReportComponent
} from "./verif-depotsouscription-report/verif-depotsouscription-report.component";
import {
  VerifDepotsouscriptionNiv1Component
} from "./verif-depotsouscription-niv1/verif-depotsouscription-niv1.component";
import {
  VerifDepotsouscriptionNiv2Component
} from "./verif-depotsouscription-niv2/verif-depotsouscription-niv2.component";
import {RestitutionReliquatComponent} from "./restitution-reliquat/restitution-reliquat.component";
import {AvisSouscriptionComponent} from "./avis-souscription/avis-souscription.component";

const routes: Routes = [
  {
    path: '',
    component: DepotsouscriptionComponent,
    children: [
      { path: '', component: DepotsouscriptionListComponent, } ,
      { path: 'new', component: DepotsouscriptionAddEditComponent, },
      { path: 'edit/:id', component: DepotsouscriptionAddEditComponent, },
      { path: 'generate/part/actionnaire', component: DepotsouscriptionGenerateComponent, },
      { path: 'verification/liste/depot', component: VerifDepotsouscriptionReportComponent, },
      { path: 'verification/niveau1/liste/depot', component: VerifDepotsouscriptionNiv1Component, },
      { path: 'verification/niveau2/liste/depot', component: VerifDepotsouscriptionNiv2Component, },
      { path: 'restitution/reliquat/souscription/actionnaire', component: RestitutionReliquatComponent, },
      { path: 'avis/souscription/actionnaire', component: AvisSouscriptionComponent, },
      { path: 'depotsouscription', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepotsouscriptionRoutingModule { }
