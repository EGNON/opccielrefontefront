import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypecompteComponent } from './typecompte.component';
import { TypecompteListComponent } from './typecompte-list/typecompte-list.component';
import { TypecompteAddEditComponent } from './typecompte-add-edit/typecompte-add-edit.component';
import { DeleteTypecompteModalComponent } from './delete-typecompte-modal/delete-typecompte-modal.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {TypecompteRoutingModule} from "./typecompte-routing.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TypecompteComponent,
    TypecompteListComponent,
    TypecompteAddEditComponent,
    DeleteTypecompteModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    TypecompteRoutingModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class TypecompteModule { }
