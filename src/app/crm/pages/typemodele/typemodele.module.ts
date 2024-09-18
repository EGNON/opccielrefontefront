import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypemodeleComponent } from './typemodele.component';
import { TypemodeleListComponent } from './typemodele-list/typemodele-list.component';
import { TypemodeleAddEditComponent } from './typemodele-add-edit/typemodele-add-edit.component';
import { DeleteTypemodeleModalComponent } from './delete-typemodele-modal/delete-typemodele-modal.component';
import {RouterOutlet} from "@angular/router";
import {TypemodeleRoutingModule} from "./typemodele-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TypemodeleComponent,
    TypemodeleListComponent,
    TypemodeleAddEditComponent,
    DeleteTypemodeleModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    TypemodeleRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypemodeleModule { }
