import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationevenementsurvaleurComponent } from './operationevenementsurvaleur.component';
import { OperationevenementsurvaleurListComponent } from './operationevenementsurvaleur-list/operationevenementsurvaleur-list.component';
import { OperationevenementsurvaleurAddEditComponent } from './operationevenementsurvaleur-add-edit/operationevenementsurvaleur-add-edit.component';
import { DeleteModalOperationevenementsurvaleurComponent } from './delete-modal-operationevenementsurvaleur/delete-modal-operationevenementsurvaleur.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {RouterOutlet} from "@angular/router";
import {OperationevenementsurvaleurRoutingModule} from "./operationevenementsurvaleur-routing.module";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    OperationevenementsurvaleurComponent,
    OperationevenementsurvaleurListComponent,
    OperationevenementsurvaleurAddEditComponent,
    DeleteModalOperationevenementsurvaleurComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    OperationevenementsurvaleurRoutingModule,
    SharedModule,
    SweetAlert2Module,
    RouterOutlet,
    NgbInputDatepicker,
    NombreDecimalDirective,
    ReactiveFormsModule
  ]
})
export class OperationevenementsurvaleurModule { }
