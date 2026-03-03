import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Affectationresultat } from './affectationresultat';
import { Tableauaffectationresultat } from './tableauaffectationresultat/tableauaffectationresultat';
import { AccountRoutingModule } from "../../../template/modules/account/account-routing.module";
import { SharedModule } from "../../../template/_metronic/shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AffectationResultatRoutingModule } from './affectationresultat-routing.module';
import { Miseenaffectation } from './miseenaffectation/miseenaffectation';
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Decisiondistribution } from './decisiondistribution/decisiondistribution';
import { EntityCrudModule } from "../../../core/modules/entity-crud/entity-crud.module";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DecisiondistributionAddEdit } from './decisiondistribution-add-edit/decisiondistribution-add-edit';
import { Phasedetachement } from './phasedetachement/phasedetachement';
import { Detachementeffectue } from './detachementeffectue/detachementeffectue';
import { Phasepaiement } from './phasepaiement/phasepaiement';
import { Paiementdividende } from './paiementdividende/paiementdividende';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import {RouterModule, RouterOutlet} from "@angular/router";


@NgModule({
  declarations: [
    Affectationresultat,
    Tableauaffectationresultat,
    Miseenaffectation,
    Decisiondistribution,
    DecisiondistributionAddEdit,
    Phasedetachement,
    Detachementeffectue,
    Phasepaiement,
    Paiementdividende
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
    AffectationResultatRoutingModule,
    NgbDatepickerModule,
    NgMultiSelectDropDownModule,
    EntityCrudModule,
    SweetAlert2Module
]
})
export class AffectationresultatModule { }
