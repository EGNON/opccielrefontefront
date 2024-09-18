import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Opcvm1Component} from "./opcvm1/opcvm1.component";
import {EtatsComponent} from "./etats.component";


const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'opcvm/liste', component: Opcvm1Component, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EtatsRoutingModule {}

