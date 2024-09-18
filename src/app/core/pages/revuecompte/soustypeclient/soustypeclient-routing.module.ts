import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SoustypeclientComponent} from "./soustypeclient.component";
import {SoustypeclientListComponent} from "./soustypeclient-list/soustypeclient-list.component";
import {SoustypeclientAddEditComponent} from "./soustypeclient-add-edit/soustypeclient-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SoustypeclientComponent,
    children: [
      { path: '', component: SoustypeclientListComponent, },
      { path: 'new', component: SoustypeclientAddEditComponent, },
      { path: 'edit/:id', component: SoustypeclientAddEditComponent, },
      { path: 'soustypeclient', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoustypeclientRoutingModule {
}
