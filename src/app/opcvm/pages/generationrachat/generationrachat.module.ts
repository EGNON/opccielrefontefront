import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerationrachatComponent } from './generationrachat.component';
import { GenerationrachatListComponent } from './generationrachat-list/generationrachat-list.component';
import { GenerationrachatAddEditComponent } from './generationrachat-add-edit/generationrachat-add-edit.component';
import { DeleteGenerationrachatModalComponent } from './delete-generationrachat-modal/delete-generationrachat-modal.component';
import { EntityCrudModule } from '../../../core/modules/entity-crud/entity-crud.module';
import { SharedModule } from '../../../template/_metronic/shared/shared.module';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { GenerationrachatRoutingModule } from './generationrachat-routing.module';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GenerationrachatComponent,
    GenerationrachatListComponent,
    GenerationrachatAddEditComponent,
    DeleteGenerationrachatModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    NgbInputDatepicker,
    GenerationrachatRoutingModule,
    NombreDecimalDirective,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class GenerationrachatModule { }
