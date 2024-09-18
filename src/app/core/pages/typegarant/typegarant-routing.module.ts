import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypegarantComponent} from "./typegarant.component";
import {TypegarantListComponent} from "./typegarant-list/typegarant-list.component";
import {TypegarantAddEditComponent} from "./typegarant-add-edit/typegarant-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypegarantComponent,
    children: [
      { path: '', component: TypegarantListComponent, },
      { path: 'new', component: TypegarantAddEditComponent, },
      { path: 'edit/:id', component: TypegarantAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typegarant', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypegarantRoutingModule { }
