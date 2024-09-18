import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EtatsRoutingModule} from "./etats-routing.module";
import {DataTablesModule} from "angular-datatables";
import { EtatsComponent } from './etats.component';
import {NgxPrintModule} from "ngx-print";
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import { DepotsuperieuracinqmillionsComponent } from './depotsuperieuracinqmillions/depotsuperieuracinqmillions.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import { DepotespecerecensesuranneeComponent } from './depotespecerecensesurannee/depotespecerecensesurannee.component';
import {NgxPaginationModule} from "ngx-pagination";
import { DepotsuperieuradixmillionsComponent } from './depotsuperieuradixmillions/depotsuperieuradixmillions.component';
import { DepotsuperieuracinqmillionsPrintComponent } from './depotsuperieuracinqmillions-print/depotsuperieuracinqmillions-print.component';
import { OperationnouvellerelationsupadixmillionsComponent } from './operationnouvellerelationsupadixmillions/operationnouvellerelationsupadixmillions.component';
import { OperationnouvellerelationsupadixmillionsPrintComponent } from './operationnouvellerelationsupadixmillions-print/operationnouvellerelationsupadixmillions-print.component';
import { DepotsuperieuradixmillionsPrintComponent } from './depotsuperieuradixmillions-print/depotsuperieuradixmillions-print.component';
import { DepotespecerecensesuranneePrintComponent } from './depotespecerecensesurannee-print/depotespecerecensesurannee-print.component';
import { RecensementopeffectueesComponent } from './recensementopeffectuees/recensementopeffectuees.component';
import { TransactionSuspectInhabituelComponent } from './transaction-suspect-inhabituel/transaction-suspect-inhabituel.component';
import { SuiviClientSanctionComponent } from './suivi-client-sanction/suivi-client-sanction.component';
import { RegistreConfidentielComponent } from './registre-confidentiel/registre-confidentiel.component';
import { OperationconditioninhabituelleComponent } from './operationconditioninhabituelle/operationconditioninhabituelle.component';
import { OperationconditioninhabituellePrintComponent } from './operationconditioninhabituelle-print/operationconditioninhabituelle-print.component';
import { OperationconditionnormaleComponent } from './operationconditionnormale/operationconditionnormale.component';
import { OperationconditionnormalePrintComponent } from './operationconditionnormale-print/operationconditionnormale-print.component';

@NgModule({
  declarations: [
       EtatsComponent,
       DepotsuperieuracinqmillionsComponent,
       DepotespecerecensesuranneeComponent,
       DepotsuperieuradixmillionsComponent,
       DepotsuperieuracinqmillionsPrintComponent,
       OperationnouvellerelationsupadixmillionsComponent,
       OperationnouvellerelationsupadixmillionsPrintComponent,
       DepotsuperieuradixmillionsPrintComponent,
       DepotespecerecensesuranneePrintComponent,
       RecensementopeffectueesComponent,
       TransactionSuspectInhabituelComponent,
       SuiviClientSanctionComponent,
       RegistreConfidentielComponent,
       DepotespecerecensesuranneePrintComponent,
       OperationconditioninhabituelleComponent,
       OperationconditioninhabituellePrintComponent,
       OperationconditionnormaleComponent,
       OperationconditionnormalePrintComponent
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    WidgetsModule,
    EtatsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    NgxPrintModule,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    SweetAlert2Module,
    NgbInputDatepicker,
    EntityCrudModule,
    DataTablesModule
  ]
})
export class EtatsModule { }
