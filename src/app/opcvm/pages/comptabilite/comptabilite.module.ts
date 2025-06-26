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
import { ListeverificationecritureV1Component } from './listeverificationecriture-v1/listeverificationecriture-v1.component';
import { ListeverificationecritureV2Component } from './listeverificationecriture-v2/listeverificationecriture-v2.component';
import { PaiementChargesComponent } from './paiement-charges/paiement-charges.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { RegulecartsoldeComponent } from './regulecartsolde/regulecartsolde.component';
import { RegulecartsoldeListComponent } from './regulecartsolde-list/regulecartsolde-list.component';
import { DeleteModalRegulecartsoldeComponent } from './delete-modal-regulecartsolde/delete-modal-regulecartsolde.component';
import { RegulecartsoldeAddEditComponent } from './regulecartsolde-add-edit/regulecartsolde-add-edit.component';
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import { PaiementCommissionInvestissementListComponent } from './paiement-commission-investissement-list/paiement-commission-investissement-list.component';
import { PaiementCommissionInvestissementAddEditComponent } from './paiement-commission-investissement-add-edit/paiement-commission-investissement-add-edit.component';
import { EcritureManuelComponent } from './ecriture-manuel/ecriture-manuel.component';
import { OperationdetachementdroitComponent } from './operationdetachementdroit/operationdetachementdroit.component';

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
    PaiementCommissionComponent,
    ListeverificationecritureV1Component,
    ListeverificationecritureV2Component,
    PaiementChargesComponent,
    RegulecartsoldeComponent,
    RegulecartsoldeListComponent,
    DeleteModalRegulecartsoldeComponent,
    RegulecartsoldeAddEditComponent,
    PaiementCommissionInvestissementListComponent,
    PaiementCommissionInvestissementAddEditComponent,
    EcritureManuelComponent,
    OperationdetachementdroitComponent
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
        SweetAlert2Module,
        NgMultiSelectDropDownModule,
        NombreDecimalDirective,
        NumeroPositifValidatorsDirective
    ]
})
export class ComptabiliteModule { }
