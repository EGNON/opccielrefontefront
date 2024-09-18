import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormuleComponent} from "./formule.component";
import {FormuleListComponent} from "./formule-list/formule-list.component";
import {FormuleAddEditComponent} from "./formule-add-edit/formule-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: FormuleComponent,
    children: [
      { path: '', component: FormuleListComponent, },
      { path: 'new', component: FormuleAddEditComponent, },
      { path: 'edit/:id', component: FormuleAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'formule', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormuleRoutingModule { }
