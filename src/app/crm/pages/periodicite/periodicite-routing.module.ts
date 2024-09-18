import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PeriodiciteComponent} from "./periodicite.component";
import {PeriodiciteListComponent} from "./periodicite-list/periodicite-list.component";
import {PeriodiciteAddEditComponent} from "./periodicite-add-edit/periodicite-add-edit.component";
import {PeriodiciteShowComponent} from "./periodicite-show/periodicite-show.component";

const routes: Routes = [
  {
    path: '',
    component: PeriodiciteComponent,
    children: [
      { path: '', component: PeriodiciteListComponent, },
      { path: 'new', component: PeriodiciteAddEditComponent, },
      { path: 'edit/:id', component: PeriodiciteAddEditComponent, },
      { path: 'show/:id', component: PeriodiciteShowComponent, },
      { path: 'periodicite', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodiciteRoutingModule {
}
