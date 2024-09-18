import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SocietedegestionComponent} from "./societedegestion.component";
import {SocietedegestionListComponent} from "./societedegestion-list/societedegestion-list.component";
import {SocietedegestionAddEditComponent} from "./societedegestion-add-edit/societedegestion-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SocietedegestionComponent,
    children: [
      { path: '', component: SocietedegestionListComponent, },
      { path: 'new', component: SocietedegestionAddEditComponent, },
      { path: 'edit/:id', component: SocietedegestionAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'societedegestion', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocieteDeGestionRoutingModule { }
