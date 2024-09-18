import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfessionComponent} from "./profession.component";
import {ProfessionListComponent} from "./profession-list/profession-list.component";
import {ProfessionAddEditComponent} from "./profession-add-edit/profession-add-edit.component";
import {ProfessionShowComponent} from "./profession-show/profession-show.component";

const routes: Routes = [
  {
    path: '',
    component: ProfessionComponent,
    children: [
      { path: '', component: ProfessionListComponent, },
      { path: 'new', component: ProfessionAddEditComponent, },
      { path: 'edit/:id', component: ProfessionAddEditComponent, },
      { path: 'show/:id', component: ProfessionShowComponent, },
      { path: 'profession', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionRoutingModule { }
