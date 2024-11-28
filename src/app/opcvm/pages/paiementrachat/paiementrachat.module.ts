import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EntityCrudModule } from '../../../core/modules/entity-crud/entity-crud.module';
import { SharedModule } from '../../../template/_metronic/shared/shared.module';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import {PaiementrachatComponent} from "./paiementrachat.component";
import { PaiementrachatListComponent } from './paiementrachat-list/paiementrachat-list.component';
import {PaiementrachatRoutingModule} from "./paiementrachat-routing.module";



@NgModule({
  declarations: [
    PaiementrachatComponent,
    PaiementrachatListComponent,

  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    NgbInputDatepicker,
    NombreDecimalDirective,
    PaiementrachatRoutingModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class PaiementrachatModule { }
