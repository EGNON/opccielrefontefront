import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnephysiqueSanctionneeComponent } from './personnephysique-sanctionnee.component';
import { PersonnephysiqueSanctionneeListComponent } from './personnephysique-sanctionnee-list/personnephysique-sanctionnee-list.component';
import { PersonnephysiqueSanctionneeAddEditComponent } from './personnephysique-sanctionnee-add-edit/personnephysique-sanctionnee-add-edit.component';
import { DeletePersonnephysiqueSanctionneeModalComponent } from './delete-personnephysique-sanctionnee-modal/delete-personnephysique-sanctionnee-modal.component';
import { PersonnephysiqueSanctionneeShowComponent } from './personnephysique-sanctionnee-show/personnephysique-sanctionnee-show.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {PersonnephysiqueSanctionneeRoutingModule} from "./personnephysique-sanctionnee-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    PersonnephysiqueSanctionneeComponent,
    PersonnephysiqueSanctionneeListComponent,
    PersonnephysiqueSanctionneeAddEditComponent,
    DeletePersonnephysiqueSanctionneeModalComponent,
    PersonnephysiqueSanctionneeShowComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    PersonnephysiqueSanctionneeRoutingModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class PersonnephysiqueSanctionneeModule { }
