import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonnaieComponent } from './monnaie.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MonnaieListComponent } from './monnaie-list/monnaie-list.component';
import {MonnaieRoutingModule} from "./monnaie-routing.module";
import {DataTablesModule} from "angular-datatables";
import { DeleteMonnaieModalComponent } from './delete-monnaie-modal/delete-monnaie-modal.component';
import { MonnaieAddEditComponent } from './monnaie-add-edit/monnaie-add-edit.component';
import { MonnaieShowComponent } from './monnaie-show/monnaie-show.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    MonnaieComponent,
    MonnaieListComponent,
    DeleteMonnaieModalComponent,
    MonnaieAddEditComponent,
    MonnaieShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        MonnaieRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class MonnaieModule { }
