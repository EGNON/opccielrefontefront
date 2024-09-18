import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OpcvmComponent} from "./opcvm.component";
import {OpcvmListComponent} from "./opcvm-list/opcvm-list.component";
import {OpcvmAddEditComponent} from "./opcvm-add-edit/opcvm-add-edit.component";
import {OpcvmEditComponent} from "./opcvm-edit/opcvm-edit.component";

const routes: Routes = [
  {
    path: '',
    component: OpcvmComponent,
    children: [
      { path: '', component: OpcvmListComponent, },
      { path: 'new', component: OpcvmAddEditComponent, },
      { path: 'edit/:id', component: OpcvmEditComponent, },
      { path: 'opcvm', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpcvmRoutingModule { }
