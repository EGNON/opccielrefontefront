import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutorisationcrRoutingModule } from './autorisationcr-routing.module';
import { AutorisationcrComponent } from './autorisationcr.component';
import { AutorisationcrListComponent } from './autorisationcr-list/autorisationcr-list.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";


@NgModule({
  declarations: [
    AutorisationcrComponent,
    AutorisationcrListComponent
  ],
  imports: [
    CommonModule,
    AutorisationcrRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module
  ]
})
export class AutorisationcrModule { }
