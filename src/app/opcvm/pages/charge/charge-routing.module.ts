import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChargeComponent} from "./charge.component";
import {ChargeListComponent} from "./charge-list/charge-list.component";
import {ChargeAddEditComponent} from "./charge-add-edit/charge-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ChargeComponent,
    children: [
      { path: '', component: ChargeListComponent, } ,
      { path: 'new', component: ChargeAddEditComponent, },
      { path: 'edit/:id', component: ChargeAddEditComponent, },
      // { path: 'show/:id', component: ChargeShowComponent, },
      { path: 'Charge', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargeRoutingModule {
}
