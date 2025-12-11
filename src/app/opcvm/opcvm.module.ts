import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpcvmRoutingModule } from './opcvm-routing.module';
import { OpcvmComponent } from './opcvm.component';
import {OpcvmRouting} from "./pages/routing";
import {RouterModule, Routes} from "@angular/router";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ConnexionComponent} from "./pages/connexion/connexion.component";


const routes: Routes = [
  {
    path: '',
    component: OpcvmComponent,
    children: OpcvmRouting,
  },
];

@NgModule({
  declarations: [
    OpcvmComponent,
    ConnexionComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    OpcvmRoutingModule,
    DataTablesModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class OpcvmModule { }
