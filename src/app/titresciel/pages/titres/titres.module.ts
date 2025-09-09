import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitresRoutingModule } from './titres-routing.module';
import { TitresComponent } from './titres.component';
import { TitresListingComponent } from './titres-listing/titres-listing.component';
import { TitresDetailsComponent } from './titres-details/titres-details.component';
import { TitresShowingComponent } from './titres-showing/titres-showing.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {DirectivesModule} from "../../../directives/directives.module";
import { TitresMajCoursComponent } from './titres-maj-cours/titres-maj-cours.component';
import {DataTablesModule} from "angular-datatables";
import { TitresVerif1 } from './titres-verif1/titres-verif1';
import { TitresVerif2 } from './titres-verif2/titres-verif2';


@NgModule({
  declarations: [
    TitresComponent,
    TitresListingComponent,
    TitresDetailsComponent,
    TitresShowingComponent,
    TitresMajCoursComponent,
    TitresVerif1,
    TitresVerif2
  ],
    imports: [
        CommonModule,
        TitresRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        FormsModule,
        NgbInputDatepicker,
        NumeroPositifValidatorsDirective,
        ReactiveFormsModule,
        DirectivesModule,
        DataTablesModule
    ]
})
export class TitresModule { }
