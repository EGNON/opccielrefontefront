import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SoustypecompteComponent} from "./soustypecompte.component";
import {SoustypecompteListComponent} from "./soustypecompte-list/soustypecompte-list.component";
import {SoustypecompteAddEditComponent} from "./soustypecompte-add-edit/soustypecompte-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SoustypecompteComponent,
    children: [
      { path: '', component: SoustypecompteListComponent, },
      { path: 'new', component: SoustypecompteAddEditComponent, },
      { path: 'edit/:id', component: SoustypecompteAddEditComponent, },
      { path: 'soustypecompte', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoustypecompteRoutingModule {
}
