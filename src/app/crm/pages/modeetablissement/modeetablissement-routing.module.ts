import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ModeetablissementComponent} from "./modeetablissement.component";
import {ModeetablissementListComponent} from "./modeetablissement-list/modeetablissement-list.component";
import {ModeetablissementAddEditComponent} from "./modeetablissement-add-edit/modeetablissement-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ModeetablissementComponent,
    children: [
      { path: '', component: ModeetablissementListComponent, },
      { path: 'new', component: ModeetablissementAddEditComponent, },
      { path: 'edit/:id', component: ModeetablissementAddEditComponent, },
      // { path: 'show/:id', component: IndicateurShowComponent, },
      { path: 'modeetablissement', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModeEtablissementRoutingModule {
}
