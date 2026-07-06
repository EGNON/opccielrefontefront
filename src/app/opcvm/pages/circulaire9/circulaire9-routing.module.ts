import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Circulaire9 } from "./circulaire9";
import { Circulaire9Print } from "./circulaire9-print/circulaire9-print";

const routes: Routes = [
  {
    path: '',
    component: Circulaire9,
    children: [
      { path: '', component: Circulaire9Print, } ,
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
export class Circulaire9RoutingModule {
}
