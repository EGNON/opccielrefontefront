import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProfilcommissionsousrachComponent} from "./profilcommissionsousrach.component";
import {ProfilcommissionsousrachListComponent} from "./profilcommissionsousrach-list/profilcommissionsousrach-list.component";
import {ProfilcommissionsousrachAddEditComponent} from "./profilcommissionsousrach-add-edit/profilcommissionsousrach-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ProfilcommissionsousrachComponent,
    children: [
      { path: '', component: ProfilcommissionsousrachListComponent, } ,
      { path: 'new', component: ProfilcommissionsousrachAddEditComponent, },
      { path: 'edit/:id', component: ProfilcommissionsousrachAddEditComponent, },
      // { path: 'show/:id', component: ProfilcommissionsousrachShowComponent, },
      { path: 'Profilcommissionsousrach', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilcommissionsousrachRoutingModule {
}
