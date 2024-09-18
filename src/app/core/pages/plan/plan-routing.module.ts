import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlanComponent} from "./plan.component";
import {PlanListComponent} from "./plan-list/plan-list.component";
import {PlanAddEditComponent} from "./plan-add-edit/plan-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: PlanComponent,
    children: [
      { path: '', component: PlanListComponent, },
      { path: 'new', component: PlanAddEditComponent, },
      { path: 'edit/:id', component: PlanAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Plan', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
