import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbenchmarkComponent } from './navbenchmark.component';
import { NavbenchmarkListComponent } from './navbenchmark-list/navbenchmark-list.component';
import { NavbenchmarkAddEditComponent } from './navbenchmark-add-edit/navbenchmark-add-edit.component';
import {NavbenchmarkRoutingModule} from "./navbenchmark-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";



@NgModule({
  declarations: [
    NavbenchmarkComponent,
    NavbenchmarkListComponent,
    NavbenchmarkAddEditComponent
  ],
  imports: [
    CommonModule,
    NavbenchmarkRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    NombreDecimalDirective,
    ReactiveFormsModule
  ]
})
export class NavbenchmarkModule { }
