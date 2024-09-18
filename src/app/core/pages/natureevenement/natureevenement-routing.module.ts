import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NatureevenementComponent} from "./natureevenement.component";
import {NatureevenementListComponent} from "./natureevenement-list/natureevenement-list.component";
import {NatureevenementAddEditComponent} from "./natureevenement-add-edit/natureevenement-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: NatureevenementComponent,
    children: [
      { path: '', component: NatureevenementListComponent, },
      { path: 'new', component: NatureevenementAddEditComponent, },
      { path: 'edit/:id', component: NatureevenementAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'natureevenement', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatureevenementRoutingModule { }
