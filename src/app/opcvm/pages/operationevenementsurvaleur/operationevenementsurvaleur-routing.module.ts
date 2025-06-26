import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OperationevenementsurvaleurComponent} from "./operationevenementsurvaleur.component";
import {OperationevenementsurvaleurListComponent} from "./operationevenementsurvaleur-list/operationevenementsurvaleur-list.component";
import {
  OperationevenementsurvaleurAddEditComponent
} from "./operationevenementsurvaleur-add-edit/operationevenementsurvaleur-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: OperationevenementsurvaleurComponent,
    children: [
      { path: 'liste', component: OperationevenementsurvaleurListComponent} ,
      { path: 'liste/new', component: OperationevenementsurvaleurAddEditComponent, },
      { path: 'liste/edit/:id', component: OperationevenementsurvaleurAddEditComponent, },
      { path: 'operationevenementsurvaleur', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationevenementsurvaleurRoutingModule {
}
