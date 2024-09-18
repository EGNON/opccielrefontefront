import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonnePhysiqueComponent} from "./personne-physique.component";
import {PersonnePhysiqueListComponent} from "./personne-physique-list/personne-physique-list.component";
import {PersonnePhysiqueAddEditComponent} from "./personne-physique-add-edit/personne-physique-add-edit.component";
import {PersonnePhysiqueShowComponent} from "./personne-physique-show/personne-physique-show.component";

const routes: Routes = [
  {
    path: ':qualite',
    component: PersonnePhysiqueComponent,
    children: [
      { path: '', component: PersonnePhysiqueListComponent, },
      { path: 'new', component: PersonnePhysiqueAddEditComponent, },
      { path: 'edit/:id', component: PersonnePhysiqueAddEditComponent, },
      { path: 'show/:id', component: PersonnePhysiqueShowComponent, },
      { path: 'conversion/:id/etat/:etat', component: PersonnePhysiqueAddEditComponent, },
      { path: 'physique', redirectTo: 'prospect', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnePhysiqueRoutingModule { }
