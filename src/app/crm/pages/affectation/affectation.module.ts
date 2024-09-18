import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffectationRoutingModule } from './affectation-routing.module';
import { AffectationComponent } from './affectation.component';
import { AffectationListComponent } from './affectation-list/affectation-list.component';
import { AffectationShowComponent } from './affectation-show/affectation-show.component';
import { AffectationAddEditComponent } from './affectation-add-edit/affectation-add-edit.component';
import { DeleteAffectationModalComponent } from './delete-affectation-modal/delete-affectation-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";


@NgModule({
  declarations: [
    AffectationComponent,
    AffectationListComponent,
    AffectationShowComponent,
    AffectationAddEditComponent,
    DeleteAffectationModalComponent
  ],
    imports: [
        CommonModule,
        AffectationRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        EntityCrudModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective
    ]
})
export class AffectationModule { }
