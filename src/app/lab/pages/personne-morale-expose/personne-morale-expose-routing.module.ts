import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonneMoraleExposeComponent} from "./personne-morale-expose.component";
import {PersonneMoraleExposeListComponent} from "./personne-morale-expose-list/personne-morale-expose-list.component";
import {
  PersonneMoraleExposeAddEditComponent
} from "./personne-morale-expose-add-edit/personne-morale-expose-add-edit.component";


const routes: Routes = [
  {
    path: '',
    component: PersonneMoraleExposeComponent,
    children: [
      { path: '', component: PersonneMoraleExposeListComponent, },
      { path: 'new', component: PersonneMoraleExposeAddEditComponent, },
      { path: 'edit/:id', component: PersonneMoraleExposeAddEditComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonneMoraleExposeRoutingModule {
}
