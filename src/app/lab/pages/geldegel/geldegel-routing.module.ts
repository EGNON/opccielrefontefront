import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {GeldegelComponent} from "./geldegel.component";
import {GeldegelAddEditComponent} from "./geldegel-add-edit/geldegel-add-edit.component";
import {GeldegelListComponent} from "./geldegel-list/geldegel-list.component";


const routes: Routes = [
  {
    path: '',
    component: GeldegelComponent,
    children: [
      { path: '', component: GeldegelListComponent, },
      { path: 'new', component: GeldegelAddEditComponent, },
      { path: 'edit/:id', component: GeldegelAddEditComponent, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeldegelRoutingModule {
}
