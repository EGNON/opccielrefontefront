import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComptecomptableComponent } from './comptecomptable.component';
import { ComptecomptableListComponent } from './comptecomptable-list/comptecomptable-list.component';
import { ComptecomptableAddEditComponent } from './comptecomptable-add-edit/comptecomptable-add-edit.component';
import { DeleteComptecomptableModalComponent } from './delete-comptecomptable-modal/delete-comptecomptable-modal.component';
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ComptecomptableRoutingModule} from "./comptecomptable-routing.module";



@NgModule({
  declarations: [
    ComptecomptableComponent,
    ComptecomptableListComponent,
    ComptecomptableAddEditComponent,
    DeleteComptecomptableModalComponent
  ],
  imports: [
    CommonModule,
    NumeroPositifValidatorsDirective,
    ReactiveFormsModule,
    RouterOutlet,
    EntityCrudModule,
    ComptecomptableRoutingModule,
    SharedModule,
    SweetAlert2Module
  ]
})
export class ComptecomptableModule { }
