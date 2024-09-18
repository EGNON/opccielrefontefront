import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeclientComponent } from './typeclient.component';
import { TypeclientListComponent } from './typeclient-list/typeclient-list.component';
import { TypeclientAddEditComponent } from './typeclient-add-edit/typeclient-add-edit.component';
import { DeleteTypeclientModalComponent } from './delete-typeclient-modal/delete-typeclient-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {TypeclientRoutingModule} from "./typeclient-routing.module";



@NgModule({
  declarations: [
    TypeclientComponent,
    TypeclientListComponent,
    TypeclientAddEditComponent,
    DeleteTypeclientModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    TypeclientRoutingModule,
    RouterLink
  ]
})
export class TypeclientModule { }
