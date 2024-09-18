import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {IndicateurComponent} from "./indicateur.component";
import {IndicateurListComponent} from "./indicateur-list/indicateur-list.component";
import {IndicateurAddEditComponent} from "./indicateur-add-edit/indicateur-add-edit.component";
import {IndicateurShowComponent} from "./indicateur-show/indicateur-show.component";

const routes: Routes = [
  {
    path: '',
    component: IndicateurComponent,
    children: [
      { path: '', component: IndicateurListComponent, },
      { path: 'new', component: IndicateurAddEditComponent, },
      { path: 'edit/:id', component: IndicateurAddEditComponent, },
      { path: 'show/:id', component: IndicateurShowComponent, },
      { path: 'indicateur', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicateurRoutingModule {
}
