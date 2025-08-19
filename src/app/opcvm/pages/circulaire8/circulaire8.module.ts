import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Circulaire8Component } from './circulaire8.component';
import { Circulaire8ListComponent } from './circulaire8-list/circulaire8-list.component';
import { Circulaire8AddEditComponent } from './circulaire8-add-edit/circulaire8-add-edit.component';
import { DeleteModalCirculaire8Component } from './delete-modal-circulaire8/delete-modal-circulaire8.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {Circulaire8RoutingModule} from "./circulaire8-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";



@NgModule({
  declarations: [
    Circulaire8Component,
    Circulaire8ListComponent,
    Circulaire8AddEditComponent,
    DeleteModalCirculaire8Component
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    Circulaire8RoutingModule,
    FormsModule,
    NgbInputDatepicker,
    NombreDecimalDirective,
    ReactiveFormsModule
  ]
})
export class Circulaire8Module { }
