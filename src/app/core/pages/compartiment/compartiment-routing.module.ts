import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompartimentComponent} from "./compartiment.component";
import {CompartimentListComponent} from "./compartiment-list/compartiment-list.component";
import {CompartimentAddEditComponent} from "./compartiment-add-edit/compartiment-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: CompartimentComponent,
    children: [
      { path: '', component: CompartimentListComponent, },
      { path: 'new', component: CompartimentAddEditComponent, },
      { path: 'edit/:id', component: CompartimentAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'compartiment', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompartimentRoutingModule { }
