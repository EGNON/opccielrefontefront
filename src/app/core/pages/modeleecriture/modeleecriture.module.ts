import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeleecritureComponent } from './modeleecriture.component';
import { ModeleecritureListComponent } from './modeleecriture-list/modeleecriture-list.component';
import { ModeleecritureAddEditComponent } from './modeleecriture-add-edit/modeleecriture-add-edit.component';
import { DeleteModeleecritureModalComponent } from './delete-modeleecriture-modal/delete-modeleecriture-modal.component';
import {ModeleecritureRoutingModule} from "./modeleecriture-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ModeleecritureComponent,
    ModeleecritureListComponent,
    ModeleecritureAddEditComponent,
    DeleteModeleecritureModalComponent
  ],
    imports: [
        CommonModule,
        ModeleecritureRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class ModeleecritureModule { }
