import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Affectationresultat } from './affectationresultat';
import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';
import { AccountRoutingModule } from "../../../template/modules/account/account-routing.module";
import { SharedModule } from "../../../template/_metronic/shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AffectationResultatRoutingModule } from './affectationresultat-routing.module';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import {RouterModule, RouterOutlet} from "@angular/router";


@NgModule({
  declarations: [
    Affectationresultat,
    Tableauaffectationresultat
  ],
  imports: [
    CommonModule,
    //AccountRoutingModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    // RouterModule,
    // RouterOutlet,
    ReactiveFormsModule,
    AffectationResultatRoutingModule
]
})
export class AffectationresultatModule { }
