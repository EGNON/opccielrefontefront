import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {QualiteComponent} from "./qualite.component";
import {QualiteListComponent} from "./qualite-list/qualite-list.component";
import {QualiteAddEditComponent} from "./qualite-add-edit/qualite-add-edit.component";
import {QualiteShowComponent} from "./qualite-show/qualite-show.component";

const routes: Routes = [
  {
    path: '',
    component: QualiteComponent,
    children: [
      { path: '', component: QualiteListComponent, },
      { path: 'new', component: QualiteAddEditComponent, },
      { path: 'edit/:id', component: QualiteAddEditComponent, },
      { path: 'show/:id', component: QualiteShowComponent, },
      { path: 'qualite', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualiteRoutingModule {
}
