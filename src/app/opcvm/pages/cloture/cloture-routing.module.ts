import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ClotureComponent} from "./cloture.component";
import {
  GenerationdifferenceestimationComponent
} from "./generationdifferenceestimation/generationdifferenceestimation.component";
import {Verificationniveau1deComponent} from "./verificationniveau1de/verificationniveau1de.component";
import {
  GenerationdifferenceestimationListComponent
} from "./generationdifferenceestimation-list/generationdifferenceestimation-list.component";
import {Verificationniveau2deComponent} from "./verificationniveau2de/verificationniveau2de.component";
import {
  Verificationecritureniveau1deComponent
} from "./verificationecritureniveau1de/verificationecritureniveau1de.component";
import {
  Verificationecritureniveau2deComponent
} from "./verificationecritureniveau2de/verificationecritureniveau2de.component";
import {AmortissementchargeComponent} from "./amortissementcharge/amortissementcharge.component";
import {Verificationchargeniveau1Component} from "./verificationchargeniveau1/verificationchargeniveau1.component";
import {Verificationchargeniveau2Component} from "./verificationchargeniveau2/verificationchargeniveau2.component";
import {
  Verificationecriturechargeniveau1Component
} from "./verificationecriturechargeniveau1/verificationecriturechargeniveau1.component";
import {
  Verificationecriturechargeniveau2Component
} from "./verificationecriturechargeniveau2/verificationecriturechargeniveau2.component";
import {
  ValorisationcodepostecompotableComponent
} from "./valorisationcodepostecompotable/valorisationcodepostecompotable.component";
import {
  Valorisationcodepostecomptablen1Component
} from "./valorisationcodepostecomptablen1/valorisationcodepostecomptablen1.component";
import {
  ValorisationcodepostecomptablenComponent
} from "./valorisationcodepostecomptablen/valorisationcodepostecomptablen.component";
import {SeanceVLComponent} from "./seance-vl/seance-vl.component";

const routes: Routes = [
  {
    path: '',
    component: ClotureComponent,
    children: [
      { path: 'generationdifferenceestimation', component: GenerationdifferenceestimationComponent, } ,
      { path: 'generationdifferenceestimation/liste', component: GenerationdifferenceestimationListComponent, } ,
      { path: 'verificationniveu1de', component: Verificationniveau1deComponent, } ,
      { path: 'verificationniveu2de', component: Verificationniveau2deComponent, } ,
      { path: 'verificationecritureniveu1de', component: Verificationecritureniveau1deComponent, } ,
      { path: 'verificationecritureniveu2de', component: Verificationecritureniveau2deComponent, } ,
      { path: 'amortissementcharge', component: AmortissementchargeComponent, } ,
      { path: 'verificationchargeniveau1', component: Verificationchargeniveau1Component, } ,
      { path: 'verificationchargeniveau2', component: Verificationchargeniveau2Component, } ,
      { path: 'verificationecriturechargeniveau1', component: Verificationecriturechargeniveau1Component, } ,
      { path: 'verificationecriturechargeniveau2', component: Verificationecriturechargeniveau2Component, } ,
      { path: 'valorisationcodeposte', component: ValorisationcodepostecompotableComponent, } ,
      { path: 'verificationvalorisationcodeposteniveau1', component: Valorisationcodepostecomptablen1Component, } ,
      { path: 'verificationvalorisationcodeposteniveau2', component: ValorisationcodepostecomptablenComponent, } ,
      { path: 'seancevl', component: SeanceVLComponent, } ,
      // { path: 'show/:id', component: TarificationordinaireShowComponent, },
      { path: 'Tarificationordinaire', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClotureRoutingModule {
}
