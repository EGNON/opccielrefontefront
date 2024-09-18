import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecteurboursierComponent} from "./secteurboursier.component";
import {SecteurboursierListComponent} from "./secteurboursier-list/secteurboursier-list.component";
import {SecteurboursierAddEditComponent} from "./secteurboursier-add-edit/secteurboursier-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SecteurboursierComponent,
    children: [
      { path: '', component: SecteurboursierListComponent, },
      { path: 'new', component: SecteurboursierAddEditComponent, },
      { path: 'edit/:id', component: SecteurboursierAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'secteurboursier', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecteurboursierRoutingModule { }
