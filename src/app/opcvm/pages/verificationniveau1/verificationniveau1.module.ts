import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Verificationniveau1Component } from './verificationniveau1.component';
import { Verificationniveau1ListComponent } from './verificationniveau1-list/verificationniveau1-list.component';
import { RouterOutlet } from '@angular/router';
import { EntityCrudModule } from '../../../core/modules/entity-crud/entity-crud.module';
import { SharedModule } from '../../../template/_metronic/shared/shared.module';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { Verificationniveau1RoutingModule } from './verificationniveau1-routing.module';



@NgModule({
  declarations: [
    Verificationniveau1Component,
    Verificationniveau1ListComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    NgbInputDatepicker,
    Verificationniveau1RoutingModule,
    NombreDecimalDirective,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class Verificationniveau1Module { }
