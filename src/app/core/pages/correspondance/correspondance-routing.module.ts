import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CorrespondanceComponent} from "./correspondance.component";
import {CorrespondanceListComponent} from "./correspondance-list/correspondance-list.component";
import {CorrespondanceAddEditComponent} from "./correspondance-add-edit/correspondance-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: CorrespondanceComponent,
    children: [
      { path: '', component: CorrespondanceListComponent, },
      { path: 'new', component: CorrespondanceAddEditComponent, },
      { path: 'edit/:id/:id2/:id3/:id4/:id5', component: CorrespondanceAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'correspondance', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrespondanceRoutingModule { }
