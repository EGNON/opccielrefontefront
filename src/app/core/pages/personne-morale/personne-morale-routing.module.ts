import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonneMoraleComponent} from "./personne-morale.component";
import {PersonneMoraleListComponent} from "./personne-morale-list/personne-morale-list.component";
import {PersonneMoraleAddEditComponent} from "./personne-morale-add-edit/personne-morale-add-edit.component";
import {PersonneMoraleShowComponent} from "./personne-morale-show/personne-morale-show.component";

const routes: Routes = [
  {
    path: ':qualite',
    component: PersonneMoraleComponent,
    children: [
      { path: '', component: PersonneMoraleListComponent, },
      { path: 'new', component: PersonneMoraleAddEditComponent, },
      { path: 'edit/:id', component: PersonneMoraleAddEditComponent, },
      { path: 'show/:id', component: PersonneMoraleShowComponent, },
      { path: 'conversion/:id/etat/:etat', component: PersonneMoraleAddEditComponent, },
      { path: 'morale', redirectTo: 'prospect', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonneMoraleRoutingModule { }
