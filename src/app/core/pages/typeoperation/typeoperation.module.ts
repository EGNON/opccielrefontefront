import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeoperationComponent } from './typeoperation.component';
import { TypeoperationListComponent } from './typeoperation-list/typeoperation-list.component';
import { TypeoperationAddEditComponent } from './typeoperation-add-edit/typeoperation-add-edit.component';
import { DeleteTypeoperationModalComponent } from './delete-typeoperation-modal/delete-typeoperation-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {TypeoperationRoutingModule} from "./typeoperation-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TypeoperationComponent,
    TypeoperationListComponent,
    TypeoperationAddEditComponent,
    DeleteTypeoperationModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    TypeoperationRoutingModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypeoperationModule { }
