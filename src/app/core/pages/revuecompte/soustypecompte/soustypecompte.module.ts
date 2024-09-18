import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoustypecompteComponent } from './soustypecompte.component';
import { SoustypecompteListComponent } from './soustypecompte-list/soustypecompte-list.component';
import { SoustypecompteAddEditComponent } from './soustypecompte-add-edit/soustypecompte-add-edit.component';
import { DeleteSoustypecompteModalComponent } from './delete-soustypecompte-modal/delete-soustypecompte-modal.component';
import {EntityCrudModule} from "../../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SoustypeactionRoutingModule} from "../../soustypeaction/soustypeaction-routing.module";
import {SoustypecompteRoutingModule} from "./soustypecompte-routing.module";



@NgModule({
  declarations: [
    SoustypecompteComponent,
    SoustypecompteListComponent,
    SoustypecompteAddEditComponent,
    DeleteSoustypecompteModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    SoustypecompteRoutingModule,
    RouterLink
  ]
})
export class SoustypecompteModule { }
