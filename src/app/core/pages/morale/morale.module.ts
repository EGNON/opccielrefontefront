import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoraleRoutingModule } from './morale-routing.module';
import { MoraleComponent } from './morale.component';
import { MoraleShowingComponent } from './morale-showing/morale-showing.component';
import { MoraleListingComponent } from './morale-listing/morale-listing.component';
import { MoraleDetailsComponent } from './morale-details/morale-details.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";

@NgModule({
  declarations: [
    MoraleComponent,
    MoraleShowingComponent,
    MoraleListingComponent,
    MoraleDetailsComponent
  ],
    imports: [
        CommonModule,
        MoraleRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        NgbInputDatepicker,
        ReactiveFormsModule,
        NumeroPositifValidatorsDirective
    ]
})
export class MoraleModule { }
