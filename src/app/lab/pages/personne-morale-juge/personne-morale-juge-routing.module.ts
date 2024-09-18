import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonneMoraleJugeComponent} from "./personne-morale-juge.component";
import {PersonneMoraleJugeListComponent} from "./personne-morale-juge-list/personne-morale-juge-list.component";
import {
  PersonneMoraleJugeAddEditComponent
} from "./personne-morale-juge-add-edit/personne-morale-juge-add-edit.component";


const routes: Routes = [
  {
    path: '',
    component: PersonneMoraleJugeComponent,
    children: [
      { path: '', component: PersonneMoraleJugeListComponent, },
      { path: 'new', component: PersonneMoraleJugeAddEditComponent, },
      { path: 'edit/:id', component: PersonneMoraleJugeAddEditComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonneMoraleJugeRoutingModule {
}
