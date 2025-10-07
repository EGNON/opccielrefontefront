import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnemoraleSanctionneeComponent } from './personnemorale-sanctionnee.component';
import { PersonnemoraleSanctionneeListComponent } from './personnemorale-sanctionnee-list/personnemorale-sanctionnee-list.component';
import { PersonnemoraleSanctionneeAddEditComponent } from './personnemorale-sanctionnee-add-edit/personnemorale-sanctionnee-add-edit.component';
import { PersonnemoraleSanctionneeShowComponent } from './personnemorale-sanctionnee-show/personnemorale-sanctionnee-show.component';
import { DeletePersonnemoraleSanctionneeModalComponent } from './delete-personnemorale-sanctionnee-modal/delete-personnemorale-sanctionnee-modal.component';
import {PersonnemoraleSanctionneeRoutingModule} from "./personnemorale-sanctionnee-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";



@NgModule({
  declarations: [
    PersonnemoraleSanctionneeComponent,
    PersonnemoraleSanctionneeListComponent,
    PersonnemoraleSanctionneeAddEditComponent,
    PersonnemoraleSanctionneeShowComponent,
    DeletePersonnemoraleSanctionneeModalComponent
  ],
  imports: [
    CommonModule,
    PersonnemoraleSanctionneeRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
]
})
export class PersonnemoraleSanctionneeModule { }
