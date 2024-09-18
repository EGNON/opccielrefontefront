import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AffectationComponent} from "./affectation.component";
import {AffectationListComponent} from "./affectation-list/affectation-list.component";
import {AffectationAddEditComponent} from "./affectation-add-edit/affectation-add-edit.component";
import {AffectationShowComponent} from "./affectation-show/affectation-show.component";

const routes: Routes = [
  {
    path: '',
    component: AffectationComponent,
    children: [
      { path: '', component: AffectationListComponent, },
      { path: 'new', component: AffectationAddEditComponent, },
      { path: 'edit/:id', component: AffectationAddEditComponent, },
      { path: 'view/:id', component: AffectationShowComponent, },
      { path: 'affectation', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffectationRoutingModule { }
