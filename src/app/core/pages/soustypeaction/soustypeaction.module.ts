import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoustypeactionComponent } from './soustypeaction.component';
import { SoustypeactionListComponent } from './soustypeaction-list/soustypeaction-list.component';
import { SoustypeactionAddEditComponent } from './soustypeaction-add-edit/soustypeaction-add-edit.component';
import { DeleteSoustypeactionModalComponent } from './delete-soustypeaction-modal/delete-soustypeaction-modal.component';
import {SoustypeactionRoutingModule} from "./soustypeaction-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SoustypeactionComponent,
    SoustypeactionListComponent,
    SoustypeactionAddEditComponent,
    DeleteSoustypeactionModalComponent
  ],
  imports: [
    CommonModule,
    SoustypeactionRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class SoustypeactionModule { }
