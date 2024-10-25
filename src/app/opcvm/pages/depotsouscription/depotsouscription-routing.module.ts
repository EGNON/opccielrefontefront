import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DepotsouscriptionComponent} from "./depotsouscription.component";
import {DepotsouscriptionListComponent} from "./depotsouscription-list/depotsouscription-list.component";
import {DepotsouscriptionAddEditComponent} from "./depotsouscription-add-edit/depotsouscription-add-edit.component";
import {DepotsouscriptionGenerateComponent} from "./depotsouscription-generate/depotsouscription-generate.component";

const routes: Routes = [
  {
    path: '',
    component: DepotsouscriptionComponent,
    children: [
      { path: '', component: DepotsouscriptionListComponent, } ,
      { path: 'new', component: DepotsouscriptionAddEditComponent, },
      { path: 'edit/:id', component: DepotsouscriptionAddEditComponent, },
      { path: 'generate/part/actionnaire', component: DepotsouscriptionGenerateComponent, },
      { path: 'depotsouscription', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepotsouscriptionRoutingModule { }
