import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SouscategorieListComponent } from './souscategorie-list/souscategorie-list.component';
import { SouscategorieAddEditComponent } from './souscategorie-add-edit/souscategorie-add-edit.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { SouscategorieComponent } from './souscategorie.component';
import {SouscategorieRoutingModule} from "./souscategorie-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DeleteSouscategorieModalComponent } from './delete-souscategorie-modal/delete-souscategorie-modal.component';



@NgModule({
  declarations: [
    SouscategorieListComponent,
    SouscategorieAddEditComponent,
    SouscategorieComponent,
    DeleteSouscategorieModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SouscategorieRoutingModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SouscategorieModule { }
