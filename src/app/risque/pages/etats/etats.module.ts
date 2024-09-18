import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { VolatiliteComponent } from './volatilite/volatilite.component';
import {DataTablesModule} from "angular-datatables";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import { AlphaComponent } from './alpha/alpha.component';
import { RatiosharpComponent } from './ratiosharp/ratiosharp.component';


@NgModule({
  declarations: [
    VolatiliteComponent,
    AlphaComponent,
    RatiosharpComponent
  ],
    imports: [
        CommonModule,
        EtatsRoutingModule,
        DataTablesModule,
        NgbInputDatepicker,
        ReactiveFormsModule
    ]
})
export class EtatsModule { }
