import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategorieListComponent} from "./categorie-list/categorie-list.component";
import {CategorieAddEditComponent} from "./categorie-add-edit/categorie-add-edit.component";
import {CategorieShowComponent} from "./categorie-show/categorie-show.component";
import {CategorieComponent} from "./categorie.component";

const routes: Routes = [
  {
    path: '',
    component: CategorieComponent,
    children: [
      { path: '', component: CategorieListComponent, },
      { path: 'new', component: CategorieAddEditComponent, },
      { path: 'edit/:id', component: CategorieAddEditComponent, },
      { path: 'show/:id', component: CategorieShowComponent, },
      { path: 'categorie', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorieRoutingModule {}
