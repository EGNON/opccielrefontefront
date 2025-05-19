import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OperationdetachementComponent} from "./operationdetachement.component";
import {OperationdetachementListComponent} from "./operationdetachement-list/operationdetachement-list.component";
import {
  OperationdetachementAddEditComponent
} from "./operationdetachement-add-edit/operationdetachement-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: OperationdetachementComponent,
    children: [
      { path: 'liste', component: OperationdetachementListComponent} ,
      { path: 'liste/new', component: OperationdetachementAddEditComponent, },
      { path: 'liste/edit/:id', component: OperationdetachementAddEditComponent, },
      { path: 'operationdetachement', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationdetachementRoutingModule {
}
