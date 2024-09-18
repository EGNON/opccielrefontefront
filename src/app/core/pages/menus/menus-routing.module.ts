import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenusComponent} from "./menus.component";
import {MenusListComponent} from "./menus-list/menus-list.component";
import {MenusAddEditComponent} from "./menus-add-edit/menus-add-edit.component";
import {MenusShowComponent} from "./menus-show/menus-show.component";

const routes: Routes = [
  {
    path: '',
    component: MenusComponent,
    children: [
      { path: '', component: MenusListComponent, },
      { path: 'new', component: MenusAddEditComponent, },
      { path: 'edit/:id', component: MenusAddEditComponent, },
      { path: 'show/:id', component: MenusShowComponent, },
      { path: 'menus', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
