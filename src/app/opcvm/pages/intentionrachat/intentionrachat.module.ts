import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntentionrachatComponent } from './intentionrachat.component';
import { IntentionrachatListComponent } from './intentionrachat-list/intentionrachat-list.component';
import { IntentionrachatAddEditComponent } from './intentionrachat-add-edit/intentionrachat-add-edit.component';
import { DeleteIntentionrachatModalComponent } from './delete-intentionrachat-modal/delete-intentionrachat-modal.component';
import { RouterOutlet } from '@angular/router';
import { EntityCrudModule } from '../../../core/modules/entity-crud/entity-crud.module';
import { SharedModule } from '../../../template/_metronic/shared/shared.module';
import { IntentionrachatRoutingModule } from './intentionrachat-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { VerifintentionrachatComponent } from './verifintentionrachat/verifintentionrachat.component';
import { Verificationniveau1Component } from './verificationniveau1/verificationniveau1.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";



@NgModule({
  declarations: [
    IntentionrachatComponent,
    IntentionrachatListComponent,
    IntentionrachatAddEditComponent,
    DeleteIntentionrachatModalComponent,
    VerifintentionrachatComponent,
    Verificationniveau1Component
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    NgbInputDatepicker,
    IntentionrachatRoutingModule,
    NombreDecimalDirective,
    SweetAlert2Module,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
]
})
export class IntentionrachatModule { }
