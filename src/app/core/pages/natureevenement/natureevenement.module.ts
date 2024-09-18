import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NatureevenementComponent } from './natureevenement.component';
import { NatureevenementListComponent } from './natureevenement-list/natureevenement-list.component';
import { NatureevenementAddEditComponent } from './natureevenement-add-edit/natureevenement-add-edit.component';
import { DeleteNatureevenementModalComponent } from './delete-natureevenement-modal/delete-natureevenement-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NatureevenementRoutingModule} from "./natureevenement-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    NatureevenementComponent,
    NatureevenementListComponent,
    NatureevenementAddEditComponent,
    DeleteNatureevenementModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    NatureevenementRoutingModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NatureevenementModule { }
