import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanAddEditComponent } from './plan-add-edit/plan-add-edit.component';
import { DeletePlanModalComponent } from './delete-plan-modal/delete-plan-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {PlanRoutingModule} from "./plan-routing.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {DataTablesModule} from "angular-datatables";
import { CompteAddEditComponent } from './compte-add-edit/compte-add-edit.component';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    PlanComponent,
    PlanListComponent,
    PlanAddEditComponent,
    DeletePlanModalComponent,
    CompteAddEditComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    PlanRoutingModule,
    ReactiveFormsModule,
    RouterLink,
    NumeroPositifValidatorsDirective,
    DataTablesModule,
    NgbInputDatepicker
  ]
})
export class PlanModule { }
