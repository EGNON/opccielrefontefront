import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {IndicateurRoutingModule} from "./indicateur-routing.module";
import { IndicateurComponent } from './indicateur.component';
import { IndicateurListComponent } from './indicateur-list/indicateur-list.component';
import { IndicateurAddEditComponent } from './indicateur-add-edit/indicateur-add-edit.component';
import { IndicateurShowComponent } from './indicateur-show/indicateur-show.component';
import { DeleteIndicateurModalComponent } from './delete-indicateur-modal/delete-indicateur-modal.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [

    IndicateurComponent,
       IndicateurListComponent,
       IndicateurAddEditComponent,
       IndicateurShowComponent,
       DeleteIndicateurModalComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        IndicateurRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class IndicateurModule { }
