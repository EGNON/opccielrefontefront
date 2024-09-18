import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeoperationComponent} from "./typeoperation.component";
import {TypeoperationListComponent} from "./typeoperation-list/typeoperation-list.component";
import {TypeoperationAddEditComponent} from "./typeoperation-add-edit/typeoperation-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeoperationComponent,
    children: [
      { path: '', component: TypeoperationListComponent, },
      { path: 'new', component: TypeoperationAddEditComponent, },
      { path: 'edit/:id', component: TypeoperationAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeoperation', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeoperationRoutingModule { }
