import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CriterealerteComponent} from "./criterealerte.component";
import {CriterealerteListComponent} from "./criterealerte-list/criterealerte-list.component";
import {CriterealerteAddEditComponent} from "./criterealerte-add-edit/criterealerte-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: CriterealerteComponent,
    children: [
      { path: '', component: CriterealerteListComponent, },
      { path: 'new', component: CriterealerteAddEditComponent, },
      { path: 'edit/:id', component: CriterealerteAddEditComponent, },
      { path: 'criterealerte', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CritereAlerteRoutingModule {
}
