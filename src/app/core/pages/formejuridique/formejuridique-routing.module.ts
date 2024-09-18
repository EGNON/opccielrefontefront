import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormejuridiqueComponent} from "./formejuridique.component";
import {FormejuridiqueListComponent} from "./formejuridique-list/formejuridique-list.component";
import {FormejuridiqueAddEditComponent} from "./formejuridique-add-edit/formejuridique-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: FormejuridiqueComponent,
    children: [
      { path: '', component: FormejuridiqueListComponent, },
      { path: 'new', component: FormejuridiqueAddEditComponent, },
      { path: 'edit/:id', component: FormejuridiqueAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'formejuridique', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormejuridiqueRoutingModule { }
