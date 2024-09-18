import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DegreComponent} from "./degre.component";
import {DegreListComponent} from "./degre-list/degre-list.component";
import {DegreAddEditComponent} from "./degre-add-edit/degre-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: DegreComponent,
    children: [
      {
        path: '',
        component: DegreListComponent,
      },
      {
        path: 'add',
        component: DegreAddEditComponent,
      },
      {
        path: 'edit/:id',
        component: DegreAddEditComponent,
      },
      { path: '', redirectTo: 'add', pathMatch: 'full' },
      { path: '**', redirectTo: 'add', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DegreRoutingModule {}
