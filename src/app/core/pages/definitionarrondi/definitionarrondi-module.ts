import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Definitionarrondi } from './definitionarrondi';
import { DefinitionarrondiList } from './definitionarrondi-list/definitionarrondi-list';
import { DefinitionarrondiAddEdit } from './definitionarrondi-add-edit/definitionarrondi-add-edit';
import { Deletedefinitionarrondimodal } from './deletedefinitionarrondimodal/deletedefinitionarrondimodal';
import { RouterModule } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { EntityCrudModule } from "../../modules/entity-crud/entity-crud.module";
import { SharedModule } from "../../../template/_metronic/shared/shared.module";
import { DefinitionArrondiRoutingModule } from './definitionarrondi-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NombreDecimalDirective } from "../../../validators/nombre-decimal.directive";



@NgModule({
  declarations: [
    Definitionarrondi,
    DefinitionarrondiList,
    DefinitionarrondiAddEdit,
    Deletedefinitionarrondimodal
  ],
  imports: [
    CommonModule,
    RouterModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    DefinitionArrondiRoutingModule,
    EntityCrudModule,
    SharedModule,
    NombreDecimalDirective
]
})
export class DefinitionarrondiModule { }
