import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AvisrachatComponent} from "./avisrachat.component";
import {AvisrachatListComponent} from "./avisrachat-list/avisrachat-list.component";

const routes: Routes = [
  {
    path: '',
    component: AvisrachatComponent,
    children: [
      { path: '', component: AvisrachatListComponent, } ,
      { path: 'avisrachat', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvisrachatRoutingModule { }
