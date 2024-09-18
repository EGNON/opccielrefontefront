import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpcvmRoutingModule } from './opcvm-routing.module';
import { OpcvmComponent } from './opcvm.component';
import { OpcvmListComponent } from './opcvm-list/opcvm-list.component';
import { OpcvmAddEditComponent } from './opcvm-add-edit/opcvm-add-edit.component';
import { OpcvmShowComponent } from './opcvm-show/opcvm-show.component';
import { DeleteOpcvmModalComponent } from './delete-opcvm-modal/delete-opcvm-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Step1Component } from './opcvm-add-edit/step1/step1.component';
import {NgbInputDatepicker, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import { Step2Component } from './opcvm-add-edit/step2/step2.component';
import { Step3Component } from './opcvm-add-edit/step3/step3.component';
import { OpcvmEditComponent } from './opcvm-edit/opcvm-edit.component';
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";


@NgModule({
  declarations: [
    OpcvmComponent,
    OpcvmListComponent,
    OpcvmAddEditComponent,
    OpcvmShowComponent,
    DeleteOpcvmModalComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    OpcvmEditComponent
  ],
  imports: [
    CommonModule,
    OpcvmRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule,
    NgbInputDatepicker,
    NumeroPositifValidatorsDirective,
    NombreDecimalDirective
  ]
})
export class OpcvmModule { }
