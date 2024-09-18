import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrintLayoutComponent} from "./print-layout.component";
import {PrintSecteurComponent} from "./reportings/print-secteur/print-secteur.component";

const routes: Routes = [
  {
    path: '',
    component: PrintLayoutComponent,
    children: [
      { path: 'print-secteur/liste', component: PrintSecteurComponent, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintLayoutRoutingModule { }
