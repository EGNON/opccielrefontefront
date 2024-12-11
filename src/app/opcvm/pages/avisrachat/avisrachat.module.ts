import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisrachatComponent } from './avisrachat.component';
import { AvisrachatListComponent } from './avisrachat-list/avisrachat-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NgxPrintDirective} from "ngx-print";
import {RouterOutlet} from "@angular/router";
import {AvisrachatRoutingModule} from "./avisrachat-routing.module";



@NgModule({
  declarations: [
    AvisrachatComponent,
    AvisrachatListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbInputDatepicker,
    NgxPrintDirective,
    AvisrachatRoutingModule,
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class AvisrachatModule { }
