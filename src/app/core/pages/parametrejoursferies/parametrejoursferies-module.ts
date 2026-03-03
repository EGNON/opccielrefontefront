import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parametrejoursferies } from './parametrejoursferies';
import { ParametrejoursferiesList } from './parametrejoursferies-list/parametrejoursferies-list';
import { ParametrejoursferiesAddEdit } from './parametrejoursferies-add-edit/parametrejoursferies-add-edit';
import { ParametreJoursFeriesRoutingModule } from './parametrejoursferies-routing.module';
import { EntityCrudModule } from "../../modules/entity-crud/entity-crud.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SharedModule } from "../../../template/_metronic/shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { Deleteparametrejoursferiesmodal } from './deleteparametrejoursferiesmodal/deleteparametrejoursferiesmodal';



@NgModule({
  declarations: [
    Parametrejoursferies,
    ParametrejoursferiesList,
    ParametrejoursferiesAddEdit,
    Deleteparametrejoursferiesmodal
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ParametreJoursFeriesRoutingModule,
    EntityCrudModule,
    SweetAlert2Module,
    SharedModule,
    NgbDatepickerModule
]
})
export class ParametrejoursferiesModule { }
