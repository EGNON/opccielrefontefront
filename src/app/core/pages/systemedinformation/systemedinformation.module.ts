import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemedinformationComponent } from './systemedinformation.component';
import { SystemedinformationListComponent } from './systemedinformation-list/systemedinformation-list.component';
import { SystemedinformationAddEditComponent } from './systemedinformation-add-edit/systemedinformation-add-edit.component';
import { DeleteSystemedinformationModalComponent } from './delete-systemedinformation-modal/delete-systemedinformation-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SystemedinformationRoutingModule} from "./systemedinformation-routing.module";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SystemedinformationComponent,
    SystemedinformationListComponent,
    SystemedinformationAddEditComponent,
    DeleteSystemedinformationModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SystemedinformationRoutingModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class SystemedinformationModule { }
