import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClotureComponent } from './cloture.component';
import { GenerationdifferenceestimationComponent } from './generationdifferenceestimation/generationdifferenceestimation.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ClotureRoutingModule} from "./cloture-routing.module";
import { Verificationniveau1deComponent } from './verificationniveau1de/verificationniveau1de.component';
import { GenerationdifferenceestimationListComponent } from './generationdifferenceestimation-list/generationdifferenceestimation-list.component';
import {DataTablesModule} from "angular-datatables";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { Verificationniveau2deComponent } from './verificationniveau2de/verificationniveau2de.component';
import { Verificationecritureniveau1deComponent } from './verificationecritureniveau1de/verificationecritureniveau1de.component';
import { Verificationecritureniveau2deComponent } from './verificationecritureniveau2de/verificationecritureniveau2de.component';
import { AmortissementchargeComponent } from './amortissementcharge/amortissementcharge.component';
import { Verificationchargeniveau1Component } from './verificationchargeniveau1/verificationchargeniveau1.component';
import { Verificationchargeniveau2Component } from './verificationchargeniveau2/verificationchargeniveau2.component';
import { Verificationecriturechargeniveau1Component } from './verificationecriturechargeniveau1/verificationecriturechargeniveau1.component';
import { Verificationecriturechargeniveau2Component } from './verificationecriturechargeniveau2/verificationecriturechargeniveau2.component';
import { ValorisationcodepostecompotableComponent } from './valorisationcodepostecompotable/valorisationcodepostecompotable.component';



@NgModule({
  declarations: [
    ClotureComponent,
    GenerationdifferenceestimationComponent,
    Verificationniveau1deComponent,
    GenerationdifferenceestimationListComponent,
    Verificationniveau2deComponent,
    Verificationecritureniveau1deComponent,
    Verificationecritureniveau2deComponent,
    AmortissementchargeComponent,
    Verificationchargeniveau1Component,
    Verificationchargeniveau2Component,
    Verificationecriturechargeniveau1Component,
    Verificationecriturechargeniveau2Component,
    ValorisationcodepostecompotableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClotureRoutingModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    SharedModule,
    NgbInputDatepicker
  ]
})
export class ClotureModule { }
