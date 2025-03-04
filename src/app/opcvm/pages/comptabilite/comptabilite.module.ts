import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
import { ComptabiliteComponent } from './comptabilite.component';
import { ConsultationEcrituresComponent } from './consultation-ecritures/consultation-ecritures.component';
import { TransfertPartsComponent } from './transfert-parts/transfert-parts.component';
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import { DetailsEcritureComponent } from './consultation-ecritures/details-ecriture/details-ecriture.component';
import { TransfertPartsListComponent } from './transfert-parts-list/transfert-parts-list.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ConstatationChargesComponent } from './constatation-charges/constatation-charges.component';
import { ConstatationChargesListComponent } from './constatation-charges-list/constatation-charges-list.component';
import { PaiementCommissionListComponent } from './paiement-commission-list/paiement-commission-list.component';
import { PaiementCommissionComponent } from './paiement-commission/paiement-commission.component';


@NgModule({
  declarations: [
    ComptabiliteComponent,
    ConsultationEcrituresComponent,
    TransfertPartsComponent,
    DetailsEcritureComponent,
    TransfertPartsListComponent,
    ConstatationChargesComponent,
    ConstatationChargesListComponent,
    PaiementCommissionListComponent,
    PaiementCommissionComponent
  ],
    imports: [
        CommonModule,
        ComptabiliteRoutingModule,
        DataTablesModule,
        FormsModule,
        NgbInputDatepicker,
        ReactiveFormsModule,
        SharedModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class ComptabiliteModule { }
