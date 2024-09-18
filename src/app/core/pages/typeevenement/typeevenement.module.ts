import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeevenementComponent } from './typeevenement.component';
import { TypeevenementListComponent } from './typeevenement-list/typeevenement-list.component';
import { TypeevenementAddEditComponent } from './typeevenement-add-edit/typeevenement-add-edit.component';
import { DeleteTypeevenementModalComponent } from './delete-typeevenement-modal/delete-typeevenement-modal.component';
import {TypeevenementRoutingModule} from "./typeevenement-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TypeevenementComponent,
    TypeevenementListComponent,
    TypeevenementAddEditComponent,
    DeleteTypeevenementModalComponent
  ],
  imports: [
    CommonModule,
    TypeevenementRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypeevenementModule { }
