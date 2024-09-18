import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {IndicateurRoutingModule} from "../indicateur/indicateur-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ModeEtablissementRoutingModule} from "./modeetablissement-routing.module";
import {IndicateurComponent} from "../indicateur/indicateur.component";
import {IndicateurListComponent} from "../indicateur/indicateur-list/indicateur-list.component";
import {IndicateurAddEditComponent} from "../indicateur/indicateur-add-edit/indicateur-add-edit.component";
import {IndicateurShowComponent} from "../indicateur/indicateur-show/indicateur-show.component";
import {DeleteIndicateurModalComponent} from "../indicateur/delete-indicateur-modal/delete-indicateur-modal.component";
import {ModeetablissementComponent} from "./modeetablissement.component";
import {ModeetablissementListComponent} from "./modeetablissement-list/modeetablissement-list.component";
import {ModeetablissementAddEditComponent} from "./modeetablissement-add-edit/modeetablissement-add-edit.component";
import {
  DeleteModeetablissementModalComponent
} from "./delete-modeetablissement-modal/delete-modeetablissement-modal.component";

@NgModule({
  declarations: [
    ModeetablissementComponent,
    ModeetablissementListComponent,
    ModeetablissementAddEditComponent,
    DeleteModeetablissementModalComponent],
  imports: [
    CommonModule,
    WidgetsModule,
    ModeEtablissementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    EntityCrudModule,
    SweetAlert2Module,
  ]
})
export class ModeetablissementModule { }
