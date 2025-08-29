import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HistoriqueactionnaireRoutingModule} from "./historiqueactionnaire-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HistoriqueactionnaireComponent} from "./historiqueactionnaire.component";
import { HistoriqueactionnaireListComponent } from './historiqueactionnaire-list/historiqueactionnaire-list.component';
import {DataTablesModule} from "angular-datatables";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    HistoriqueactionnaireComponent,
    HistoriqueactionnaireListComponent
  ],
  imports: [
    CommonModule,
    HistoriqueactionnaireRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbInputDatepicker
  ]
})
export class HistoriqueactionnaireModule { }
