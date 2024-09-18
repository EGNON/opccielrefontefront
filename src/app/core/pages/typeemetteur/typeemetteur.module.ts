import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeemetteurComponent } from './typeemetteur.component';
import { TypeemetteurListComponent } from './typeemetteur-list/typeemetteur-list.component';
import { TypeemetteurAddEditComponent } from './typeemetteur-add-edit/typeemetteur-add-edit.component';
import { DeleteTypeemetteurModalComponent } from './delete-typeemetteur-modal/delete-typeemetteur-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {TypeemetteurRoutingModule} from "./typeemetteur-routing.module";



@NgModule({
  declarations: [
    TypeemetteurComponent,
    TypeemetteurListComponent,
    TypeemetteurAddEditComponent,
    DeleteTypeemetteurModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    TypeemetteurRoutingModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class TypeemetteurModule { }
