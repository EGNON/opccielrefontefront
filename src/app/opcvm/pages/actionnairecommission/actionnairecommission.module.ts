import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionnairecommissionComponent } from './actionnairecommission.component';
import { ActionnairecommissionListComponent } from './actionnairecommission-list/actionnairecommission-list.component';
import { ActionnairecommissionAddEditComponent } from './actionnairecommission-add-edit/actionnairecommission-add-edit.component';
import { DeleteActionnairecommissionModalComponent } from './delete-actionnairecommission-modal/delete-actionnairecommission-modal.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {RouterOutlet} from "@angular/router";
import {ActionnairecommissionRoutingModule} from "./actionnairecommission-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    ActionnairecommissionComponent,
    ActionnairecommissionListComponent,
    ActionnairecommissionAddEditComponent,
    DeleteActionnairecommissionModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ActionnairecommissionRoutingModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    NgbInputDatepicker
  ]
})
export class ActionnairecommissionModule { }
