import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhysiqueRoutingModule } from './physique-routing.module';
import { PhysiqueComponent } from './physique.component';
import { PhysiqueDetailsComponent } from './physique-details/physique-details.component';
import { PhysiqueListingComponent } from './physique-listing/physique-listing.component';
import { PhysiqueShowingComponent } from './physique-showing/physique-showing.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {DirectivesModule} from "../../../directives/directives.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";

@NgModule({
  declarations: [
    PhysiqueComponent,
    PhysiqueDetailsComponent,
    PhysiqueListingComponent,
    PhysiqueShowingComponent
  ],
    imports: [
        CommonModule,
        PhysiqueRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        NgbInputDatepicker,
        ReactiveFormsModule,
        DirectivesModule,
        NumeroPositifValidatorsDirective
    ]
})
export class PhysiqueModule { }
