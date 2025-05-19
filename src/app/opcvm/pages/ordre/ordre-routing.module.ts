import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OrdreComponent} from "./ordre.component";
import {OrdreListComponent} from "./ordre-list/ordre-list.component";
import {
  ProfilcommissionsousrachAddEditComponent
} from "../profilcommissionsousrach/profilcommissionsousrach-add-edit/profilcommissionsousrach-add-edit.component";
import {OrdreAddEditComponent} from "./ordre-add-edit/ordre-add-edit.component";
import {OrdreCreateComponent} from "./ordre-create/ordre-create.component";
import {ValidationOrdreComponent} from "./validation-ordre/validation-ordre.component";
import {ImpressionOrdreComponent} from "./impression-ordre/impression-ordre.component";
import {OrdreencoursComponent} from "./ordreencours/ordreencours.component";
import {AvisoperationbourseListComponent} from "./avisoperationbourse-list/avisoperationbourse-list.component";
import {
  AvisoperationbourseAddEditComponent
} from "./avisoperationbourse-add-edit/avisoperationbourse-add-edit.component";
import {ReglementlivraisonComponent} from "./reglementlivraison/reglementlivraison.component";
import {
  GenerationreglementlivraisonComponent
} from "./generationreglementlivraison/generationreglementlivraison.component";

const routes: Routes = [
  {
    path: '',
    component: OrdreComponent,
    children: [
      { path: 'liste', component: OrdreListComponent, } ,
      { path: 'liste/avisoperationbourse', component: OrdreencoursComponent, } ,
      { path: 'liste/avisoperationbourse/liste/:id', component: AvisoperationbourseListComponent, } ,
      { path: 'liste/avisoperationbourse/liste/:id/new', component: AvisoperationbourseAddEditComponent, } ,
      { path: 'liste/reglementlivraison', component: ReglementlivraisonComponent, } ,
      { path: 'liste/reglementlivraison/generation', component: GenerationreglementlivraisonComponent, } ,
      { path: 'liste/new', component: OrdreCreateComponent, },
      { path: 'liste/validation', component: ValidationOrdreComponent, },
      { path: 'liste/impression', component: ImpressionOrdreComponent, },
      { path: 'liste/edit/:id', component: OrdreCreateComponent, },
      // { path: 'show/:id', component: IntentionrachatShowComponent, },
      { path: 'ordre', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdreRoutingModule {
}
