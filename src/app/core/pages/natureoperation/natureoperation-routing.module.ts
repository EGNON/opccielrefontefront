import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NatureoperationComponent} from "./natureoperation.component";
import {NatureoperationListComponent} from "./natureoperation-list/natureoperation-list.component";
import {NatureoperationAddEditComponent} from "./natureoperation-add-edit/natureoperation-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: NatureoperationComponent,
    children: [
      { path: '', component: NatureoperationListComponent, },
      { path: 'new', component: NatureoperationAddEditComponent, },
      { path: 'edit/:id', component: NatureoperationAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'natureoperation', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatureoperationRoutingModule { }
