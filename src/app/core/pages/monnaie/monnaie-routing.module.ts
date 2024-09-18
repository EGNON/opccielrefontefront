import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MonnaieComponent} from "./monnaie.component";
import {MonnaieListComponent} from "./monnaie-list/monnaie-list.component";
import {MonnaieAddEditComponent} from "./monnaie-add-edit/monnaie-add-edit.component";
import {MonnaieShowComponent} from "./monnaie-show/monnaie-show.component";

const routes: Routes = [
  {
    path: '',
    component: MonnaieComponent,
    children: [
      { path: '', component: MonnaieListComponent, },
      { path: 'new', component: MonnaieAddEditComponent, },
      { path: 'edit/:id', component: MonnaieAddEditComponent, },
      { path: 'show/:id', component: MonnaieShowComponent, },
      { path: 'monnaie', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonnaieRoutingModule {}
