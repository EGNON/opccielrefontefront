import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {RdvComponent} from "./rdv.component";
import {RdvListComponent} from "./rdv-list/rdv-list.component";
import {RdvCreateComponent} from "./rdv-create/rdv-create.component";
import {RdvUpdateComponent} from "./rdv-update/rdv-update.component";
import {RdvAddEditComponent} from "./rdv-add-edit/rdv-add-edit.component";
import {RdvShowComponent} from "./rdv-show/rdv-show.component";


const routes: Routes = [
  {
    path: '',
    component: RdvComponent,
    children: [
          { path: '', component: RdvListComponent, },
          { path: 'new', component: RdvCreateComponent, },
          { path: 'edit/:id', component: RdvCreateComponent, },
          { path: 'view/:id', component: RdvShowComponent, },
          { path: 'update/:id', component: RdvUpdateComponent, },
          { path: 'nouveau', component: RdvAddEditComponent, },
          { path: 'modifier/:id', component: RdvAddEditComponent, },
          { path: 'rdv', redirectTo: '', pathMatch: 'full' },
          { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RdvRoutingModule {
}
