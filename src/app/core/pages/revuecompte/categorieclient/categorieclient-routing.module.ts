import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CategorieclientComponent} from "./categorieclient.component";
import {CategorieclientListComponent} from "./categorieclient-list/categorieclient-list.component";
import {CategorieclientAddEditComponent} from "./categorieclient-add-edit/categorieclient-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: CategorieclientComponent,
    children: [
      { path: '', component: CategorieclientListComponent, },
      { path: 'new', component: CategorieclientAddEditComponent, },
      { path: 'edit/:id', component: CategorieclientAddEditComponent, },
      { path: 'Categorieclient', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategorieclientRoutingModule {
}
