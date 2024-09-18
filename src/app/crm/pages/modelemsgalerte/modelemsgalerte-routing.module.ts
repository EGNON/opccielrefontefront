import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ModelemsgalerteComponent} from "./modelemsgalerte.component";
import {ModelemsgalerteListComponent} from "./modelemsgalerte-list/modelemsgalerte-list.component";
import {ModelemsgalerteCreateComponent} from "./modelemsgalerte-create/modelemsgalerte-create.component";

const routes: Routes = [
  {
    path: '',
    component: ModelemsgalerteComponent,
    children: [
          { path: '', component: ModelemsgalerteListComponent, },
          { path: 'new', component: ModelemsgalerteCreateComponent, },
          { path: 'edit/:id', component: ModelemsgalerteCreateComponent, },
          { path: 'rdv', redirectTo: '', pathMatch: 'full' },
          { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelemsgalerteRoutingModule {
}
