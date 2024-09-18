import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionnaireopcvmComponent } from './actionnaireopcvm.component';
import { ActionnaireopcvmListComponent } from './actionnaireopcvm-list/actionnaireopcvm-list.component';
import { ActionnaireopcvmAddEditComponent } from './actionnaireopcvm-add-edit/actionnaireopcvm-add-edit.component';
import { DeleteActionnaireopcvmModalComponent } from './delete-actionnaireopcvm-modal/delete-actionnaireopcvm-modal.component';
import {ActionnaireopcvmRoutingModule} from "./actionnaireopcvm-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ActionnaireopcvmComponent,
    ActionnaireopcvmListComponent,
    ActionnaireopcvmAddEditComponent,
    DeleteActionnaireopcvmModalComponent
  ],
    imports: [
        CommonModule,
        ActionnaireopcvmRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        ReactiveFormsModule
    ]
})
export class ActionnaireopcvmModule { }
