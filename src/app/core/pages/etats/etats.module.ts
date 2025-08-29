import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtatsComponent } from './etats.component';
import { PointtresorerieComponent } from './pointtresorerie/pointtresorerie.component';
import {EtatsRoutingModule} from "./etats-routing.module";
import { PointtresorerieetatComponent } from './pointtresorerieetat/pointtresorerieetat.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import { ProcedurecomptableComponent } from './procedurecomptable/procedurecomptable.component';
import { ReleveactionnaireComponent } from './releveactionnaire/releveactionnaire.component';
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {NgxPaginationModule} from "ngx-pagination";
import { FicheclientComponent } from './ficheclient/ficheclient.component';
import { EtatsuiviactionnaireComponent } from './etatsuiviactionnaire/etatsuiviactionnaire.component';
import { EtatsuiviclientComponent } from './etatsuiviclient/etatsuiviclient.component';



@NgModule({
  declarations: [
    EtatsComponent,
    PointtresorerieComponent,
    PointtresorerieetatComponent,
    ProcedurecomptableComponent,
    ReleveactionnaireComponent,
    FicheclientComponent,
    EtatsuiviactionnaireComponent,
    EtatsuiviclientComponent
  ],
  imports: [
    CommonModule,
    EtatsRoutingModule,
    EntityCrudModule,
    DataTablesModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class EtatsModule { }
