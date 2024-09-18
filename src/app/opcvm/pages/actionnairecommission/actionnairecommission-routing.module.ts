import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ActionnairecommissionComponent} from "./actionnairecommission.component";
import {ActionnairecommissionListComponent} from "./actionnairecommission-list/actionnairecommission-list.component";
import {ActionnairecommissionAddEditComponent} from "./actionnairecommission-add-edit/actionnairecommission-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ActionnairecommissionComponent,
    children: [
      { path: '', component: ActionnairecommissionListComponent, } ,
      { path: 'new', component: ActionnairecommissionAddEditComponent, },
      { path: 'edit/:id/:id2/:id3', component: ActionnairecommissionAddEditComponent, },
      // { path: 'show/:id', component: ActionnairecommissionShowComponent, },
      { path: 'actionnairecommission', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionnairecommissionRoutingModule {
}
