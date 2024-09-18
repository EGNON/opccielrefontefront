import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRoutingModule } from './lab-routing.module';
import { LabComponent } from './lab.component';
import {RouterModule, Routes} from "@angular/router";
import {LabRouting} from "./pages/routing";

const routes: Routes = [
  {
    path: '',
    component: LabComponent,
    children: LabRouting,
  },
];

@NgModule({
  declarations: [
    LabComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    LabRoutingModule
  ]
})
export class LabModule { }
