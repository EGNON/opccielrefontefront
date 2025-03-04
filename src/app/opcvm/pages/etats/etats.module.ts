import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { EtatsComponent } from './etats.component';
import { RegistreActionnaireComponent } from './registre-actionnaire/registre-actionnaire.component';
import {DataTablesModule} from "angular-datatables";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";


@NgModule({
  declarations: [
    EtatsComponent,
    RegistreActionnaireComponent
  ],
    imports: [
        CommonModule,
        EtatsRoutingModule,
        DataTablesModule,
        NgbInputDatepicker,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class EtatsModule { }
