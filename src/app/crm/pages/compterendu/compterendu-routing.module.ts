import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CompterenduComponent} from "./compterendu.component";
import {CompterenduListComponent} from "./compterendu-list/compterendu-list.component";
import {CompterenduAddEditComponent} from "./compterendu-add-edit/compterendu-add-edit.component";
import {CompterenduShowComponent} from "./compterendu-show/compterendu-show.component";

const routes: Routes = [
  {
    path: '',
    component: CompterenduComponent,
    children: [
      { path: '', component: CompterenduListComponent, },
      { path: 'new', component: CompterenduAddEditComponent, },
      { path: 'edit/:id', component: CompterenduAddEditComponent, },
      { path: 'view/:id', component: CompterenduShowComponent, },
      { path: 'validate/:id', component: CompterenduAddEditComponent, },
      { path: 'compterendu', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompterenduRoutingModule {
}
