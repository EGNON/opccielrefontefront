import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PeriodiciteRoutingModule} from "./periodicite-routing.module";
import { PeriodiciteComponent } from './periodicite.component';
import { PeriodiciteListComponent } from './periodicite-list/periodicite-list.component';
import { PeriodiciteShowComponent } from './periodicite-show/periodicite-show.component';
import { PeriodiciteAddEditComponent } from './periodicite-add-edit/periodicite-add-edit.component';
import { DeletePeriodiciteModalComponent } from './delete-periodicite-modal/delete-periodicite-modal.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";

@NgModule({
  declarations: [
    PeriodiciteComponent,
    PeriodiciteListComponent,
    PeriodiciteShowComponent,
    PeriodiciteAddEditComponent,
    DeletePeriodiciteModalComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        PeriodiciteRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class PeriodiciteModule { }
