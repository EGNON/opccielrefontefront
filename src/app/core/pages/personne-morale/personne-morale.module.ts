import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonneMoraleRoutingModule } from './personne-morale-routing.module';
import { DeletePersonneMoraleModalComponent } from './delete-personne-morale-modal/delete-personne-morale-modal.component';
import { PersonneMoraleShowComponent } from './personne-morale-show/personne-morale-show.component';
import { PersonneMoraleListComponent } from './personne-morale-list/personne-morale-list.component';
import { PersonneMoraleAddEditComponent } from './personne-morale-add-edit/personne-morale-add-edit.component';
import { PersonneMoraleComponent } from './personne-morale.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";

@NgModule({
  declarations: [
    DeletePersonneMoraleModalComponent,
    PersonneMoraleShowComponent,
    PersonneMoraleListComponent,
    PersonneMoraleAddEditComponent,
    PersonneMoraleComponent
  ],
    imports: [
        CommonModule,
        PersonneMoraleRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgbInputDatepicker,
        EntityCrudModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective
    ]
})
export class PersonneMoraleModule { }
