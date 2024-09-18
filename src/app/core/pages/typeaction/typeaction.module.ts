import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeactionComponent } from './typeaction.component';
import { TypeactionAddEditComponent } from './typeaction-add-edit/typeaction-add-edit.component';
import { TypeactionListComponent } from './typeaction-list/typeaction-list.component';
import { DeleteTypeactionModalComponent } from './delete-typeaction-modal/delete-typeaction-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {RouterLink, RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TypeactionRoutingModule} from "./typeaction-routing.module";



@NgModule({
  declarations: [
    TypeactionComponent,
    TypeactionAddEditComponent,
    TypeactionListComponent,
    DeleteTypeactionModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    TypeactionRoutingModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class TypeactionModule { }
