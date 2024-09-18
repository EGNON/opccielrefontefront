import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoustypeclientComponent } from './soustypeclient.component';
import { SoustypeclientListComponent } from './soustypeclient-list/soustypeclient-list.component';
import { SoustypeclientAddEditComponent } from './soustypeclient-add-edit/soustypeclient-add-edit.component';
import { DeleteSoustypeclientModalComponent } from './delete-soustypeclient-modal/delete-soustypeclient-modal.component';
import {EntityCrudModule} from "../../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SoustypeclientRoutingModule} from "./soustypeclient-routing.module";



@NgModule({
  declarations: [
    SoustypeclientComponent,
    SoustypeclientListComponent,
    SoustypeclientAddEditComponent,
    DeleteSoustypeclientModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    SoustypeclientRoutingModule,
    RouterLink
  ]
})
export class SoustypeclientModule { }
