import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ActionnaireopcvmComponent} from "./actionnaireopcvm.component";
import {ActionnaireopcvmListComponent} from "./actionnaireopcvm-list/actionnaireopcvm-list.component";
import {ActionnaireopcvmAddEditComponent} from "./actionnaireopcvm-add-edit/actionnaireopcvm-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ActionnaireopcvmComponent,
    children: [
      { path: '', component: ActionnaireopcvmListComponent, } ,
      { path: 'new', component: ActionnaireopcvmAddEditComponent, },
      { path: 'edit/:id', component: ActionnaireopcvmAddEditComponent, },
      // { path: 'show/:id', component: ActionnaireopcvmShowComponent, },
      { path: 'actionnaireopcvm', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionnaireopcvmRoutingModule {
}
