import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TypemodeleComponent} from "./typemodele.component";
import {TypemodeleListComponent} from "./typemodele-list/typemodele-list.component";
import {TypemodeleAddEditComponent} from "./typemodele-add-edit/typemodele-add-edit.component";


const routes: Routes = [
  {
    path: '',
    component: TypemodeleComponent,
    children: [
          { path: '', component: TypemodeleListComponent, },
          { path: 'new', component: TypemodeleAddEditComponent, },
          { path: 'edit/:id', component: TypemodeleAddEditComponent, },
          { path: 'nouveau', component: TypemodeleAddEditComponent, },
          { path: 'modifier/:id', component: TypemodeleAddEditComponent, },
          { path: 'Typemodele', redirectTo: '', pathMatch: 'full' },
          { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypemodeleRoutingModule {
}
