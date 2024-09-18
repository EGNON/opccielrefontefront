import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EtatsComponent } from './etats.component';
import {RouterOutlet} from "@angular/router";
import { Opcvm1Component } from './opcvm1/opcvm1.component';
import {EtatsRoutingModule} from "./etats-routing.module";
// import {EtatsRoutingModule} from "../../../lab/pages/etats/etats-routing.module";



@NgModule({
  declarations: [
    EtatsComponent,
    Opcvm1Component,
  ],
  imports: [
    CommonModule,
    EtatsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class EtatsModule { }
