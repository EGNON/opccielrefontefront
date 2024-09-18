import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonnePhysiqueComponent} from "./personne-physique.component";
import {PersonnePhysiqueAddEditComponent} from "./personne-physique-add-edit/personne-physique-add-edit.component";
import {PersonnePhysiqueShowComponent} from "./personne-physique-show/personne-physique-show.component";
import {PersonnePhysiqueListComponent} from "./personne-physique-list/personne-physique-list.component";

const routes: Routes = [
  {
    path: '',
    component: PersonnePhysiqueComponent,
    children: [
      { path: '', component: PersonnePhysiqueListComponent, },
      { path: 'new', component: PersonnePhysiqueAddEditComponent, },
      { path: 'edit/:id', component: PersonnePhysiqueAddEditComponent, },
      { path: 'view/:id', component: PersonnePhysiqueShowComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonnePhysiqueRoutingModule {
}
