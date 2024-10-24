import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepotsouscriptionRoutingModule } from './depotsouscription-routing.module';
import { DepotsouscriptionComponent } from './depotsouscription.component';
import { DepotsouscriptionListComponent } from './depotsouscription-list/depotsouscription-list.component';
import { DepotsouscriptionAddEditComponent } from './depotsouscription-add-edit/depotsouscription-add-edit.component';
import { DepotsouscriptionGenerateComponent } from './depotsouscription-generate/depotsouscription-generate.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker, NgbTimepicker} from "@ng-bootstrap/ng-bootstrap";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";


@NgModule({
  declarations: [
    DepotsouscriptionComponent,
    DepotsouscriptionListComponent,
    DepotsouscriptionAddEditComponent,
    DepotsouscriptionGenerateComponent
  ],
  imports: [
    CommonModule,
    DepotsouscriptionRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    EditorComponent,
    FormsModule,
    NgbInputDatepicker,
    NgbTimepicker,
    NumeroPositifValidatorsDirective,
    ReactiveFormsModule
  ]
})
export class DepotsouscriptionModule { }
