import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonnemoraleSanctionneeComponent} from "./personnemorale-sanctionnee.component";
import {
  PersonnemoraleSanctionneeListComponent
} from "./personnemorale-sanctionnee-list/personnemorale-sanctionnee-list.component";
import {
  PersonnemoraleSanctionneeAddEditComponent
} from "./personnemorale-sanctionnee-add-edit/personnemorale-sanctionnee-add-edit.component";
import {
  PersonnemoraleSanctionneeShowComponent
} from "./personnemorale-sanctionnee-show/personnemorale-sanctionnee-show.component";

const routes: Routes = [
  {
    path: '',
    component: PersonnemoraleSanctionneeComponent,
    children: [
      { path: '', component: PersonnemoraleSanctionneeListComponent, },
      { path: 'new', component: PersonnemoraleSanctionneeAddEditComponent, },
      { path: 'edit/:id', component: PersonnemoraleSanctionneeAddEditComponent, },
      { path: 'view/:id', component: PersonnemoraleSanctionneeShowComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonnemoraleSanctionneeRoutingModule {
}
