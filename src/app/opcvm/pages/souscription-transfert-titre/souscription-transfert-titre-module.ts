import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SouscriptionTransfertTitre } from './souscription-transfert-titre';
import { SouscriptionTransfertTitreList } from './souscription-transfert-titre-list/souscription-transfert-titre-list';
import { SouscriptionTransfertTitreAddEdit } from './souscription-transfert-titre-add-edit/souscription-transfert-titre-add-edit';
import { EntityCrudModule } from "../../../core/modules/entity-crud/entity-crud.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SharedModule } from "../../../template/_metronic/shared/shared.module";
import { SouscriptionTransfertTitreRoutingModule } from './souscription-transfert-titre-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NombreDecimalDirective } from "../../../validators/nombre-decimal.directive";
import { Verifsouscriptiontransferttitre } from './verifsouscriptiontransferttitre/verifsouscriptiontransferttitre';



@NgModule({
  declarations: [
    SouscriptionTransfertTitre,
    SouscriptionTransfertTitreList,
    SouscriptionTransfertTitreAddEdit,
    Verifsouscriptiontransferttitre
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SweetAlert2Module,
    SouscriptionTransfertTitreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule,
    NombreDecimalDirective
]
})
export class SouscriptionTransfertTitreModule { }
