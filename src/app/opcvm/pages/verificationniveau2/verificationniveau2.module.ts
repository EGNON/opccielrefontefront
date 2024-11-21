import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Verificationniveau2Component } from './verificationniveau2.component';
import { Verificationniveau2ListComponent } from './verificationniveau2-list/verificationniveau2-list.component';
import { RouterOutlet } from '@angular/router';
import { EntityCrudModule } from '../../../core/modules/entity-crud/entity-crud.module';
import { SharedModule } from '../../../template/_metronic/shared/shared.module';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Verificationniveau2RoutingModule } from './verificationniveau2-routing.module';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Verificationniveau2Component,
    Verificationniveau2ListComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    NgbInputDatepicker,
    Verificationniveau2RoutingModule,
    NombreDecimalDirective,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class Verificationniveau2Module { }
