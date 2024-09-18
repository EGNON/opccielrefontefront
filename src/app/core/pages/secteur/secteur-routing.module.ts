import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecteurComponent} from "./secteur.component";
import {SecteurListComponent} from "./secteur-list/secteur-list.component";
import {SecteurAddEditComponent} from "./secteur-add-edit/secteur-add-edit.component";
import {SecteurShowComponent} from "./secteur-show/secteur-show.component";

const routes: Routes = [
  {
    path: '',
    component: SecteurComponent,
    children: [
      { path: '', component: SecteurListComponent, },
      { path: 'new', component: SecteurAddEditComponent, },
      { path: 'edit/:id', component: SecteurAddEditComponent, },
      { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'secteur', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecteurRoutingModule { }
