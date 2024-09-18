import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComptecomptableComponent} from "./comptecomptable.component";
import {ComptecomptableListComponent} from "./comptecomptable-list/comptecomptable-list.component";
import {ComptecomptableAddEditComponent} from "./comptecomptable-add-edit/comptecomptable-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ComptecomptableComponent,
    children: [
      { path: '', component: ComptecomptableListComponent, },
      { path: 'new', component: ComptecomptableAddEditComponent, },
      { path: 'edit/:id', component: ComptecomptableAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'comptecomptable', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptecomptableRoutingModule { }
