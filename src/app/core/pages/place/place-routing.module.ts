import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlaceComponent} from "./place.component";
import {PlaceListComponent} from "./place-list/place-list.component";
import {PlaceAddEditComponent} from "./place-add-edit/place-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: PlaceComponent,
    children: [
      { path: '', component: PlaceListComponent, },
      { path: 'new', component: PlaceAddEditComponent, },
      { path: 'edit/:id', component: PlaceAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Place', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
