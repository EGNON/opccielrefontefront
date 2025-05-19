import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {NavbenchmarkComponent} from "./navbenchmark.component";
import {NavbenchmarkListComponent} from "./navbenchmark-list/navbenchmark-list.component";
import {NavbenchmarkAddEditComponent} from "./navbenchmark-add-edit/navbenchmark-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: NavbenchmarkComponent,
    children: [
      { path: 'liste', component: NavbenchmarkListComponent, } ,
      { path: 'liste/edit/:id/:id2', component: NavbenchmarkAddEditComponent, },
      // { path: 'show/:id', component: IntentionrachatShowComponent, },
      { path: 'navbenchmark/liste', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbenchmarkRoutingModule {
}
