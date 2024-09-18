import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormejuridiqueListComponent } from './formejuridique-list/formejuridique-list.component';
import { FormejuridiqueAddEditComponent } from './formejuridique-add-edit/formejuridique-add-edit.component';
import { FormejuridiqueComponent } from './formejuridique.component';
import {FormejuridiqueRoutingModule} from "./formejuridique-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DeleteFormejuridiqueModalComponent } from './delete-formejuridique-modal/delete-formejuridique-modal.component';



@NgModule({
  declarations: [


    FormejuridiqueListComponent,
         FormejuridiqueAddEditComponent,
         FormejuridiqueComponent,
         DeleteFormejuridiqueModalComponent
  ],
  imports: [
    CommonModule,
    FormejuridiqueRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormejuridiqueModule { }
