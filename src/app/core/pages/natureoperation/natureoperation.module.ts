import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NatureoperationComponent } from './natureoperation.component';
import { DeleteNatureoperationModalComponent } from './delete-natureoperation-modal/delete-natureoperation-modal.component';
import { NatureoperationAddEditComponent } from './natureoperation-add-edit/natureoperation-add-edit.component';
import { NatureoperationListComponent } from './natureoperation-list/natureoperation-list.component';
import {NatureoperationRoutingModule} from "./natureoperation-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    NatureoperationComponent,
    DeleteNatureoperationModalComponent,
    NatureoperationAddEditComponent,
    NatureoperationListComponent
  ],
  imports: [
    CommonModule,
    NatureoperationRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NatureoperationModule { }
