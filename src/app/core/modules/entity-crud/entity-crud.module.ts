import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EntityCrudComponent} from "./entity-crud.component";

@NgModule({
  declarations: [EntityCrudComponent],
  imports: [
    CommonModule, DataTablesModule,
    SweetAlert2Module.forChild(),
    NgbModalModule,
    NgbModule
  ],
  exports: [EntityCrudComponent]
})
export class EntityCrudModule { }
