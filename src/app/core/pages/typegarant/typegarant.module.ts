import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypegarantComponent } from './typegarant.component';
import { DeleteTypegarantModalComponent } from './delete-typegarant-modal/delete-typegarant-modal.component';
import { TypegarantAddEditComponent } from './typegarant-add-edit/typegarant-add-edit.component';
import { TypegarantListComponent } from './typegarant-list/typegarant-list.component';
import {TypegarantRoutingModule} from "./typegarant-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TypegarantComponent,
    DeleteTypegarantModalComponent,
    TypegarantAddEditComponent,
    TypegarantListComponent
  ],
  imports: [
    CommonModule,
    TypegarantRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypegarantModule { }
