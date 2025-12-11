import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { SouscriptionTransfertTitre } from "./souscription-transfert-titre";
import { SouscriptionTransfertTitreList } from "./souscription-transfert-titre-list/souscription-transfert-titre-list";
import { SouscriptionTransfertTitreAddEdit } from "./souscription-transfert-titre-add-edit/souscription-transfert-titre-add-edit";

const routes: Routes = [
  {
    path: '',
    component: SouscriptionTransfertTitre,
    children: [
      { path: '', component: SouscriptionTransfertTitreList, } ,
      { path: 'new', component: SouscriptionTransfertTitreAddEdit, },
      { path: 'edit/:id', component: SouscriptionTransfertTitreAddEdit, },
      // { path: 'show/:id', component: TarificationordinaireShowComponent, },
      { path: 'souscriptiontransferttitre', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SouscriptionTransfertTitreRoutingModule {
}
