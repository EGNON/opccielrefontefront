import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonnephysiqueSanctionneeComponent} from "./personnephysique-sanctionnee.component";
import {
  PersonnephysiqueSanctionneeListComponent
} from "./personnephysique-sanctionnee-list/personnephysique-sanctionnee-list.component";
import {
  PersonnephysiqueSanctionneeAddEditComponent
} from "./personnephysique-sanctionnee-add-edit/personnephysique-sanctionnee-add-edit.component";
import {
  PersonnephysiqueSanctionneeShowComponent
} from "./personnephysique-sanctionnee-show/personnephysique-sanctionnee-show.component";

const routes: Routes = [
  {
    path: '',
    component: PersonnephysiqueSanctionneeComponent,
    children: [
      { path: '', component: PersonnephysiqueSanctionneeListComponent, },
      { path: 'new', component: PersonnephysiqueSanctionneeAddEditComponent, },
      { path: 'edit/:id', component: PersonnephysiqueSanctionneeAddEditComponent, },
      { path: 'view/:id', component: PersonnephysiqueSanctionneeShowComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonnephysiqueSanctionneeRoutingModule {
}
