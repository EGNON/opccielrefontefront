import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Circulaire9 } from './circulaire9';
import { Circulaire9Print } from './circulaire9-print/circulaire9-print';
import { RouterOutlet } from "@angular/router";
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { Circulaire9RoutingModule } from './circulaire9-routing.module';



@NgModule({
  declarations: [
    Circulaire9,
    Circulaire9Print
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    NgbInputDatepicker,
        ReactiveFormsModule,
        Circulaire9RoutingModule
]
})
export class Circulaire9Module { }
