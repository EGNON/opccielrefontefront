import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ObjectifsComponent} from "./objectifs.component";
import {ObjectifsListComponent} from "./objectifs-list/objectifs-list.component";
import {ObjectifsAddEditComponent} from "./objectifs-add-edit/objectifs-add-edit.component";
import {ObjectifsShowComponent} from "./objectifs-show/objectifs-show.component";

const routes: Routes = [
  {
    path: '',
    component: ObjectifsComponent,
    children: [
      { path: '', component: ObjectifsListComponent, },
      { path: 'new', component: ObjectifsAddEditComponent, },
      { path: 'edit/:id', component: ObjectifsAddEditComponent, },
      { path: 'show/:id', component: ObjectifsShowComponent, },
      { path: 'objectifaffecter', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectifsRoutingModule { }
