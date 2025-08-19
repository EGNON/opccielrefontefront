import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {Circulaire8Component} from "./circulaire8.component";
import {Circulaire8ListComponent} from "./circulaire8-list/circulaire8-list.component";
import {Circulaire8AddEditComponent} from "./circulaire8-add-edit/circulaire8-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: Circulaire8Component,
    children: [
      { path: '', component: Circulaire8ListComponent, } ,
      { path: 'new', component: Circulaire8AddEditComponent, },
      { path: 'edit/:id', component: Circulaire8AddEditComponent, },
      // { path: 'show/:id', component: ChargeShowComponent, },
      { path: 'Charge', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Circulaire8RoutingModule {
}
