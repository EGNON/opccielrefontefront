import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectifAtteintComponent} from "./objectif-atteint.component";
import {ObjectifAtteintListComponent} from "./objectif-atteint-list/objectif-atteint-list.component";
import {ObjectifAtteintRapportComponent} from "./objectif-atteint-rapport/objectif-atteint-rapport.component";
import {ObjectifAtteintShowComponent} from "./objectif-atteint-show/objectif-atteint-show.component";

const routes: Routes = [
  {
    path: '',
    component: ObjectifAtteintComponent,
    children: [
      { path: 'affectation', component: ObjectifAtteintListComponent, },
      { path: 'affectation/:id/rapport', component: ObjectifAtteintRapportComponent, },
      { path: 'affectation/view/:id', component: ObjectifAtteintShowComponent, },
      { path: '', redirectTo: 'affectation', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectifAtteintRoutingModule { }
