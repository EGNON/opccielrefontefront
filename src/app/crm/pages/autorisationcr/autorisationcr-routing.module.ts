import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AutorisationcrListComponent} from "./autorisationcr-list/autorisationcr-list.component";

const routes: Routes = [
  {
    path: '',
    component: AutorisationcrListComponent,
    children: [
      { path: '', component: AutorisationcrListComponent, },
      { path: 'autorisationcr', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorisationcrRoutingModule { }
