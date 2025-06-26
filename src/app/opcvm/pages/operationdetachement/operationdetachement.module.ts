import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationdetachementComponent } from './operationdetachement.component';
import { OperationdetachementListComponent } from './operationdetachement-list/operationdetachement-list.component';
import { OperationdetachementAddEditComponent } from './operationdetachement-add-edit/operationdetachement-add-edit.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {OperationdetachementRoutingModule} from "./operationdetachement-routing.module";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import {ReactiveFormsModule} from "@angular/forms";
import { DeleteModalOperationdetachementComponent } from './delete-modal-operationdetachement/delete-modal-operationdetachement.component';



@NgModule({
  declarations: [
    OperationdetachementComponent,
    OperationdetachementListComponent,
    OperationdetachementAddEditComponent,
    DeleteModalOperationdetachementComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    OperationdetachementRoutingModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
    NombreDecimalDirective,
    ReactiveFormsModule
  ]
})
export class OperationdetachementModule { }
