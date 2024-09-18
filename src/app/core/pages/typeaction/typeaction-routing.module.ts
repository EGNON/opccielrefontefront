import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeactionComponent} from "./typeaction.component";
import {TypeactionListComponent} from "./typeaction-list/typeaction-list.component";
import {TypeactionAddEditComponent} from "./typeaction-add-edit/typeaction-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeactionComponent,
    children: [
      { path: '', component: TypeactionListComponent, },
      { path: 'new', component: TypeactionAddEditComponent, },
      { path: 'edit/:id', component: TypeactionAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeaction', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeactionRoutingModule { }
