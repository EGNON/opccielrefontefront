import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {IntentionrachatComponent} from "./intentionrachat.component";
import {IntentionrachatListComponent} from "./intentionrachat-list/intentionrachat-list.component";
import {IntentionrachatAddEditComponent} from "./intentionrachat-add-edit/intentionrachat-add-edit.component";
import { Verificationniveau1Component } from "./verificationniveau1/verificationniveau1.component";

const routes: Routes = [
  {
    path: '',
    component: IntentionrachatComponent,
    children: [
      { path: '', component: IntentionrachatListComponent} ,
      { path: 'new/:id2', component: IntentionrachatAddEditComponent, },
      { path: 'edit/:id/:id2', component: IntentionrachatAddEditComponent, },
      { path: 'verificationintentionniveau1', component: Verificationniveau1Component, },
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
export class IntentionrachatRoutingModule {
}
