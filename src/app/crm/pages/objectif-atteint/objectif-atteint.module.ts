import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectifAtteintRoutingModule } from './objectif-atteint-routing.module';
import { ObjectifAtteintListComponent } from './objectif-atteint-list/objectif-atteint-list.component';
import { ObjectifAtteintComponent } from './objectif-atteint.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ObjectifAtteintRapportComponent } from './objectif-atteint-rapport/objectif-atteint-rapport.component';
import {ReactiveFormsModule} from "@angular/forms";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import { ObjectifAtteintShowComponent } from './objectif-atteint-show/objectif-atteint-show.component';
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";


@NgModule({
  declarations: [
    ObjectifAtteintListComponent,
    ObjectifAtteintComponent,
    ObjectifAtteintRapportComponent,
    ObjectifAtteintShowComponent
  ],
    imports: [
        CommonModule,
        ObjectifAtteintRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        ReactiveFormsModule,
        NumeroPositifValidatorsDirective
    ]
})
export class ObjectifAtteintModule { }
