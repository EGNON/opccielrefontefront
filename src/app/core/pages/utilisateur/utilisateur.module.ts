import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { UtilisateurListComponent } from './utilisateur-list/utilisateur-list.component';
import { UtilisateurAddEditComponent } from './utilisateur-add-edit/utilisateur-add-edit.component';
import { UtilisateurShowComponent } from './utilisateur-show/utilisateur-show.component';
import { DeleteUtilisateurModalComponent } from './delete-utilisateur-modal/delete-utilisateur-modal.component';
import { UtilisateurComponent } from './utilisateur.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbCollapse, NgbInputDatepicker, NgbPagination, NgbTimepicker, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {CrudModule} from "../../../template/modules/crud/crud.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    UtilisateurListComponent,
    UtilisateurAddEditComponent,
    UtilisateurShowComponent,
    DeleteUtilisateurModalComponent,
    UtilisateurComponent
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    CrudModule,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule,
    SharedModule,
    SweetAlert2Module,
    EntityCrudModule,
    NgbInputDatepicker,
    NgbTimepicker,
    NgMultiSelectDropDownModule,
    NumeroPositifValidatorsDirective,
    NgbCollapse,
    NgxPaginationModule,
    NgbPagination
  ]
})
export class UtilisateurModule { }
