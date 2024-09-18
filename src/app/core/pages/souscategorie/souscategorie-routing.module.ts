import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SouscategorieComponent} from "./souscategorie.component";
import {SouscategorieListComponent} from "./souscategorie-list/souscategorie-list.component";
import {SouscategorieAddEditComponent} from "./souscategorie-add-edit/souscategorie-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SouscategorieComponent,
    children: [
      { path: '', component: SouscategorieListComponent, },
      { path: 'new', component: SouscategorieAddEditComponent, },
      { path: 'edit/:id', component: SouscategorieAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'souscategorie', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SouscategorieRoutingModule { }
