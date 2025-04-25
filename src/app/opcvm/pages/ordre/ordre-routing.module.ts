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

const routes: Routes = [
  {
    path: '',
    component: OrdreComponent,
    children: [
      { path: 'liste', component: OrdreListComponent, } ,
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
