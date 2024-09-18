import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DegreComponent} from "./degre.component";
import {DegreListComponent} from "./degre-list/degre-list.component";
import {RouterLink} from "@angular/router";
import {DegreRoutingModule} from "./degre-routing.module";
import { DegreAddEditComponent } from './degre-add-edit/degre-add-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import { DeleteDegreModalComponent } from './delete-degre-modal/delete-degre-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    DegreComponent,
    DegreListComponent,
    DegreAddEditComponent,
    DeleteDegreModalComponent
  ],
    imports: [
        CommonModule,
        DegreRoutingModule,
        RouterLink,
        ReactiveFormsModule,
        DataTablesModule,
        SharedModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class DegreModule { }
