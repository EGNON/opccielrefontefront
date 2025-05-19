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
import {OrdreencoursComponent} from "./ordreencours/ordreencours.component";
import {Avisoperationbourse} from "../../models/avisoperationbourse.model";
import {AvisoperationbourseListComponent} from "./avisoperationbourse-list/avisoperationbourse-list.component";
import {
  AvisoperationbourseAddEditComponent
} from "./avisoperationbourse-add-edit/avisoperationbourse-add-edit.component";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import { ReglementlivraisonComponent } from './reglementlivraison/reglementlivraison.component';
import { GenerationreglementlivraisonComponent } from './generationreglementlivraison/generationreglementlivraison.component';

@NgModule({
  declarations: [
    OrdreComponent,
    OrdreListComponent,
    OrdreAddEditComponent,
    DeleteOrdreModalComponent,
    OrdreCreateComponent,
    OrdreencoursComponent,
    AvisoperationbourseListComponent,
    AvisoperationbourseAddEditComponent,
    ValidationOrdreComponent,
    ImpressionOrdreComponent,
    ReglementlivraisonComponent,
    GenerationreglementlivraisonComponent
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
        NgMultiSelectDropDownModule,
        NumeroPositifValidatorsDirective
    ]
})
export class OrdreModule { }
