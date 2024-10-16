import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { VolatiliteComponent } from './volatilite/volatilite.component';
import {DataTablesModule} from "angular-datatables";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import { AlphaComponent } from './alpha/alpha.component';
import { RatiosharpComponent } from './ratiosharp/ratiosharp.component';
import { CorrelationComponent } from './correlation/correlation.component';
import { CovarianceComponent } from './covariance/covariance.component';
import { BetaComponent } from './beta/beta.component';
import { RatiotreynorComponent } from './ratiotreynor/ratiotreynor.component';
import { NombreDecimalDirective } from '../../../validators/nombre-decimal.directive';
import { NumeroPositifValidatorsDirective } from '../../../validators/numero-positif-validators.directive';


@NgModule({
  declarations: [
    VolatiliteComponent,
    AlphaComponent,
    RatiosharpComponent,
    CorrelationComponent,
    CovarianceComponent,
    BetaComponent,
    RatiotreynorComponent

  ],
    imports: [
        CommonModule,
        EtatsRoutingModule,
        DataTablesModule,
        NgbInputDatepicker,
        ReactiveFormsModule,
      NombreDecimalDirective,
      NumeroPositifValidatorsDirective
    ]
})
export class EtatsModule { }
