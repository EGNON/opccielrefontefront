import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PaysComponent} from "./pays.component";
import {PaysListComponent} from "./pays-list/pays-list.component";
import {PaysAddEditComponent} from "./pays-add-edit/pays-add-edit.component";
import {PaysShowComponent} from "./pays-show/pays-show.component";

const routes: Routes = [
  {
    path: '',
    component: PaysComponent,
    children: [
      { path: '', component: PaysListComponent, },
      { path: 'new', component: PaysAddEditComponent, },
      { path: 'edit/:id', component: PaysAddEditComponent, },
      { path: 'show/:id', component: PaysShowComponent, },
      { path: 'pays', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaysRoutingModule {
}
