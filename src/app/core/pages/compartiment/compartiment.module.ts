import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartimentListComponent } from './compartiment-list/compartiment-list.component';
import { CompartimentAddEditComponent } from './compartiment-add-edit/compartiment-add-edit.component';
import { DeleteCompartimentModalComponent } from './delete-compartiment-modal/delete-compartiment-modal.component';
import { CompartimentComponent } from './compartiment.component';
import {CompartimentRoutingModule} from "./compartiment-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CompartimentListComponent,
    CompartimentAddEditComponent,
    DeleteCompartimentModalComponent,
    CompartimentComponent
  ],
  imports: [
    CommonModule,
    CompartimentRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CompartimentModule { }
