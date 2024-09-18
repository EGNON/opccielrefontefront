import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IbrubriquepositionComponent} from "./ibrubriqueposition.component";
import {IbrubriquepositionListComponent} from "./ibrubriqueposition-list/ibrubriqueposition-list.component";
import {IbrubriquepositionAddEditComponent} from "./ibrubriqueposition-add-edit/ibrubriqueposition-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: IbrubriquepositionComponent,
    children: [
      { path: '', component: IbrubriquepositionListComponent, },
      { path: 'new', component: IbrubriquepositionAddEditComponent, },
      { path: 'edit/:id/:id2/:id3', component: IbrubriquepositionAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Ibrubriqueposition', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IbrubriquepositionRoutingModule { }
