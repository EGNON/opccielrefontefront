import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRouting } from './pages/routing';
import {RouterModule, Routes} from "@angular/router";
import {CrmComponent} from "./crm.component";

const routes: Routes = [
  {
    path: '',
    component: CrmComponent,
    children: CrmRouting,
  },
];

@NgModule({
  declarations: [
    CrmComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CrmModule { }
