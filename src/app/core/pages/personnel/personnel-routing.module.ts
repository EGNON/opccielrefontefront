import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonnelShowComponent} from "./personnel-show/personnel-show.component";
import {PersonnelAddEditComponent} from "./personnel-add-edit/personnel-add-edit.component";
import {PersonnelListComponent} from "./personnel-list/personnel-list.component";
import {PersonnelComponent} from "./personnel.component";

const routes: Routes = [
  {
    path: '',
    component: PersonnelComponent,
    children: [
      { path: '', component: PersonnelListComponent, },
      { path: 'new', component: PersonnelAddEditComponent, },
      { path: 'edit/:id', component: PersonnelAddEditComponent, },
      { path: 'view/:id', component: PersonnelShowComponent, },
      { path: 'personnels', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule { }
