import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorieclientComponent } from './categorieclient.component';
import { CategorieclientListComponent } from './categorieclient-list/categorieclient-list.component';
import { CategorieclientAddEditComponent } from './categorieclient-add-edit/categorieclient-add-edit.component';
import { DeleteCategorieclientModalComponent } from './delete-categorieclient-modal/delete-categorieclient-modal.component';
import {CategorieclientRoutingModule} from "./categorieclient-routing.module";
import {EntityCrudModule} from "../../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CategorieclientComponent,
    CategorieclientListComponent,
    CategorieclientAddEditComponent,
    DeleteCategorieclientModalComponent
  ],
  imports: [
    CommonModule,
    CategorieclientRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class CategorieclientModule { }
