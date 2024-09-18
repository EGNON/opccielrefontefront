import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TypecompteComponent} from "./typecompte.component";
import {TypecompteListComponent} from "./typecompte-list/typecompte-list.component";
import {TypecompteAddEditComponent} from "./typecompte-add-edit/typecompte-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypecompteComponent,
    children: [
      { path: '', component: TypecompteListComponent, },
      { path: 'new', component: TypecompteAddEditComponent, },
      { path: 'edit/:id', component: TypecompteAddEditComponent, },
      { path: 'typecompte', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypecompteRoutingModule {
}
