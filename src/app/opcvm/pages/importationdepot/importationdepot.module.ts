import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportationdepotRoutingModule } from './importationdepot-routing.module';
import { ImportationdepotComponent } from './importationdepot.component';
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";

@NgModule({
  declarations: [
    ImportationdepotComponent
  ],
  imports: [
    CommonModule,
    ImportationdepotRoutingModule,
    DataTablesModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    EntityCrudModule
  ]
})
export class ImportationdepotModule { }
