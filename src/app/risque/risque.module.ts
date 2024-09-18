import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RisqueRoutingModule } from './risque-routing.module';
import { RisqueComponent } from './risque.component';
import {RouterModule, Routes} from "@angular/router";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {RisqueRouting} from "./pages/routing";

const routes: Routes = [
  {
    path: '',
    component: RisqueComponent,
    children: RisqueRouting,
  },
];

@NgModule({
  declarations: [
    RisqueComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    RisqueRoutingModule,
    DataTablesModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class RisqueModule { }
