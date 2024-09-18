import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OifComponent} from "./oif.component";
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {Routing} from "./pages/routing";

const routes: Routes = [
  {
    path: '',
    component: OifComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    OifComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    RouterOutlet
  ]
})
export class OifModule { }
