import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Verificationniveau1Component } from "./verificationniveau1.component";
import { Verificationniveau1ListComponent } from "./verificationniveau1-list/verificationniveau1-list.component";

const routes: Routes = [
  {
    path: '',
    component: Verificationniveau1Component,
    children: [
      { path: '', component: Verificationniveau1ListComponent, } ,
      // { path: 'show/:id', component: IntentionrachatShowComponent, },
      { path: 'Intentionrachat', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Verificationniveau1RoutingModule {
}
