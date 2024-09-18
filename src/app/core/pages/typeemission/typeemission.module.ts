import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeemissionComponent } from './typeemission.component';
import { TypeemissionListComponent } from './typeemission-list/typeemission-list.component';
import { TypeemissionAddEditComponent } from './typeemission-add-edit/typeemission-add-edit.component';
import { DeleteTypeemissionModalComponent } from './delete-typeemission-modal/delete-typeemission-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TypeemissionRoutingModule} from "./typeemission-routing.module";



@NgModule({
  declarations: [
    TypeemissionComponent,
    TypeemissionListComponent,
    TypeemissionAddEditComponent,
    DeleteTypeemissionModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    TypeemissionRoutingModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class TypeemissionModule { }
