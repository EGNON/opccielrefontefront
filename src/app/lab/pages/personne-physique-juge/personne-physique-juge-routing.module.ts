import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PersonnePhysiqueJugeComponent} from "./personne-physique-juge.component";
import {PersonnePhysiqueJugeListComponent} from "./personne-physique-juge-list/personne-physique-juge-list.component";
import {
  PersonnePhysiqueJugeAddEditComponent
} from "./personne-physique-juge-add-edit/personne-physique-juge-add-edit.component";
import {PersonnePhysiqueJugeShowComponent} from "./personne-physique-juge-show/personne-physique-juge-show.component";


const routes: Routes = [
  {
    path: '',
    component: PersonnePhysiqueJugeComponent,
    children: [
      { path: '', component: PersonnePhysiqueJugeListComponent, },
      { path: 'new', component: PersonnePhysiqueJugeAddEditComponent, },
      { path: 'edit/:id', component: PersonnePhysiqueJugeAddEditComponent, },
      { path: 'view/:id', component: PersonnePhysiqueJugeShowComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonnePhysiqueJugeRoutingModule {
}
