import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormuleComponent } from './formule.component';
import { FormuleListComponent } from './formule-list/formule-list.component';
import { FormuleAddEditComponent } from './formule-add-edit/formule-add-edit.component';
import { DeleteFormuleModalComponent } from './delete-formule-modal/delete-formule-modal.component';
import {FormuleRoutingModule} from "./formule-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    FormuleComponent,
    FormuleListComponent,
    FormuleAddEditComponent,
    DeleteFormuleModalComponent
  ],
  imports: [
    CommonModule,
    FormuleRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class FormuleModule { }
