import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BanqueComponent} from "./banque.component";
import {BanqueListComponent} from "./banque-list/banque-list.component";
import {BanqueAddEditComponent} from "./banque-add-edit/banque-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: BanqueComponent,
    children: [
      { path: '', component: BanqueListComponent, },
      { path: 'new', component: BanqueAddEditComponent, },
      { path: 'edit/:id', component: BanqueAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Banque', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanqueRoutingModule { }
