import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModeleformuleComponent} from "./modeleformule.component";
import {ModeleformuleListComponent} from "./modeleformule-list/modeleformule-list.component";
import {ModeleformuleAddEditComponent} from "./modeleformule-add-edit/modeleformule-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ModeleformuleComponent,
    children: [
      { path: '', component: ModeleformuleListComponent, },
      { path: 'new', component: ModeleformuleAddEditComponent, },
      { path: 'edit/:id', component: ModeleformuleAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Modeleformule', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeleformuleRoutingModule { }
