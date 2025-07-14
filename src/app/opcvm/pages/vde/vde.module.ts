import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VdeComponent } from './vde.component';
import { OperationextournevdeComponent } from './operationextournevde/operationextournevde.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {RouterOutlet} from "@angular/router";
import {VdeRoutingModule} from "./vde-routing.module";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { OperationextournevdeAddEditComponent } from './operationextournevde-add-edit/operationextournevde-add-edit.component';
import { Verificationniveau1vdeComponent } from './verificationniveau1vde/verificationniveau1vde.component';
import { Verificationniveau1modalvdeComponent } from './verificationniveau1modalvde/verificationniveau1modalvde.component';
import { Verificationniveau2modalvdeComponent } from './verificationniveau2modalvde/verificationniveau2modalvde.component';
import { Verificationextourneniveau1modalvdeComponent } from './verificationextourneniveau1modalvde/verificationextourneniveau1modalvde.component';
import { Verificationextourneniveau2modalvdeComponent } from './verificationextourneniveau2modalvde/verificationextourneniveau2modalvde.component';
import { SoldecompteextourneComponent } from './soldecompteextourne/soldecompteextourne.component';



@NgModule({
  declarations: [
    VdeComponent,
    OperationextournevdeComponent,
    OperationextournevdeAddEditComponent,
    Verificationniveau1vdeComponent,
    Verificationniveau1modalvdeComponent,
    Verificationniveau2modalvdeComponent,
    Verificationextourneniveau1modalvdeComponent,
    Verificationextourneniveau2modalvdeComponent,
    SoldecompteextourneComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    VdeRoutingModule,
    RouterOutlet,
    DataTablesModule,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class VDEModule { }
