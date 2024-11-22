import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Verificationniveau2Component } from "./verificationniveau2.component";
import { Verificationniveau2ListComponent } from "./verificationniveau2-list/verificationniveau2-list.component";

const routes: Routes = [
  {
    path: '',
    component: Verificationniveau2Component,
    children: [
      { path: '', component: Verificationniveau2ListComponent, } ,
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
export class Verificationniveau2RoutingModule {
}
