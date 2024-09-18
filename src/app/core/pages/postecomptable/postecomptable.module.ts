import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostecomptableComponent } from './postecomptable.component';
import { PostecomptableListComponent } from './postecomptable-list/postecomptable-list.component';
import { PostecomptableAddEditComponent } from './postecomptable-add-edit/postecomptable-add-edit.component';
import { DeletePostecomptableModalComponent } from './delete-postecomptable-modal/delete-postecomptable-modal.component';
import {PostecomptableRoutingModule} from "./postecomptable-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";



@NgModule({
  declarations: [
    PostecomptableComponent,
    PostecomptableListComponent,
    PostecomptableAddEditComponent,
    DeletePostecomptableModalComponent
  ],
  imports: [
    CommonModule,
    PostecomptableRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    NumeroPositifValidatorsDirective,
    ReactiveFormsModule
  ]
})
export class PostecomptableModule { }
