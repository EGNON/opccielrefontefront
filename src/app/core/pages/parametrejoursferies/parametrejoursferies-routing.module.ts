import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Parametrejoursferies } from "./parametrejoursferies";
import { ParametrejoursferiesList } from "./parametrejoursferies-list/parametrejoursferies-list";
import { ParametrejoursferiesAddEdit } from "./parametrejoursferies-add-edit/parametrejoursferies-add-edit";

const routes: Routes = [
  {
    path: '',
    component: Parametrejoursferies,
    children: [
      { path: '', component: ParametrejoursferiesList, },
      { path: 'new', component: ParametrejoursferiesAddEdit, },
      { path: 'edit/:id', component: ParametrejoursferiesAddEdit, },
      { path: 'pays', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametreJoursFeriesRoutingModule {
}
