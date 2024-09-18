import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TypeclientComponent} from "./typeclient.component";
import {TypeclientListComponent} from "./typeclient-list/typeclient-list.component";
import {TypeclientAddEditComponent} from "./typeclient-add-edit/typeclient-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeclientComponent,
    children: [
      { path: '', component: TypeclientListComponent, },
      { path: 'new', component: TypeclientAddEditComponent, },
      { path: 'edit/:id', component: TypeclientAddEditComponent, },
      { path: 'typeclient', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeclientRoutingModule {
}
