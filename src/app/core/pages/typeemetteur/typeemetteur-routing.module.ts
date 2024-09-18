import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeemetteurComponent} from "./typeemetteur.component";
import {TypeemetteurListComponent} from "./typeemetteur-list/typeemetteur-list.component";
import {TypeemetteurAddEditComponent} from "./typeemetteur-add-edit/typeemetteur-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeemetteurComponent,
    children: [
      { path: '', component: TypeemetteurListComponent, },
      { path: 'new', component: TypeemetteurAddEditComponent, },
      { path: 'edit/:id', component: TypeemetteurAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeemetteur', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeemetteurRoutingModule { }
