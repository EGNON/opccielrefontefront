import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SystemedinformationComponent} from "./systemedinformation.component";
import {SystemedinformationListComponent} from "./systemedinformation-list/systemedinformation-list.component";
import {
  SystemedinformationAddEditComponent
} from "./systemedinformation-add-edit/systemedinformation-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SystemedinformationComponent,
    children: [
      { path: '', component: SystemedinformationListComponent, },
      { path: 'new', component: SystemedinformationAddEditComponent, },
      { path: 'edit/:id', component: SystemedinformationAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'systemedinformation', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemedinformationRoutingModule { }
