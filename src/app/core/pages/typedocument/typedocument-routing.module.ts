import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TypedocumentComponent} from "./typedocument.component";
import {TypedocumentListComponent} from "./typedocument-list/typedocument-list.component";
import {TypedocumentAddEditComponent} from "./typedocument-add-edit/typedocument-add-edit.component";
import {TypedocumentShowComponent} from "./typedocument-show/typedocument-show.component";

const routes: Routes = [
  {
    path: '',
    component: TypedocumentComponent,
    children: [
      { path: '', component: TypedocumentListComponent, },
      { path: 'new', component: TypedocumentAddEditComponent, },
      { path: 'edit/:id', component: TypedocumentAddEditComponent, },
      { path: 'show/:id', component: TypedocumentShowComponent, },
      { path: 'profession', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypedocumentRoutingModule {
}
