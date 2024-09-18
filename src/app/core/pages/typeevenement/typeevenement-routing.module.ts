import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeevenementComponent} from "./typeevenement.component";
import {TypeevenementListComponent} from "./typeevenement-list/typeevenement-list.component";
import {TypeevenementAddEditComponent} from "./typeevenement-add-edit/typeevenement-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeevenementComponent,
    children: [
      { path: '', component: TypeevenementListComponent, },
      { path: 'new', component: TypeevenementAddEditComponent, },
      { path: 'edit/:id', component: TypeevenementAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeevenement', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeevenementRoutingModule { }
