import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdreComponent } from './ordre.component';
import { OrdreListComponent } from './ordre-list/ordre-list.component';
import { OrdreAddEditComponent } from './ordre-add-edit/ordre-add-edit.component';
import { DeleteOrdreModalComponent } from './delete-ordre-modal/delete-ordre-modal.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {OrdreRoutingModule} from "./ordre-routing.module";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { OrdreCreateComponent } from './ordre-create/ordre-create.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { ValidationOrdreComponent } from './validation-ordre/validation-ordre.component';
import { ImpressionOrdreComponent } from './impression-ordre/impression-ordre.component';

@NgModule({
  declarations: [
    OrdreComponent,
    OrdreListComponent,
    OrdreAddEditComponent,
    DeleteOrdreModalComponent,
    OrdreCreateComponent,
    ValidationOrdreComponent,
    ImpressionOrdreComponent
  ],
    imports: [
        CommonModule,
        RouterOutlet,
        EntityCrudModule,
        SharedModule,
        OrdreRoutingModule,
        SweetAlert2Module,
        NombreDecimalDirective,
        ReactiveFormsModule,
        NgbInputDatepicker,
        FormsModule,
        NgMultiSelectDropDownModule
    ]
})
export class OrdreModule { }
