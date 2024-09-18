import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeemissionComponent} from "./typeemission.component";
import {TypeemissionListComponent} from "./typeemission-list/typeemission-list.component";
import {TypeemissionAddEditComponent} from "./typeemission-add-edit/typeemission-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeemissionComponent,
    children: [
      { path: '', component: TypeemissionListComponent, },
      { path: 'new', component: TypeemissionAddEditComponent, },
      { path: 'edit/:id', component: TypeemissionAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeemission', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeemissionRoutingModule { }
