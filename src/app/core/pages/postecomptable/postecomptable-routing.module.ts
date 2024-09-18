import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostecomptableComponent} from "./postecomptable.component";
import {PostecomptableListComponent} from "./postecomptable-list/postecomptable-list.component";
import {PostecomptableAddEditComponent} from "./postecomptable-add-edit/postecomptable-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: PostecomptableComponent,
    children: [
      { path: '', component: PostecomptableListComponent, },
      { path: 'new', component: PostecomptableAddEditComponent, },
      { path: 'edit/:id/:id2', component: PostecomptableAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Postecomptable', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostecomptableRoutingModule { }
