import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ImportationdepotComponent} from "./importationdepot.component";

const routes: Routes = [
  {
    path: '',
    component: ImportationdepotComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportationdepotRoutingModule { }
