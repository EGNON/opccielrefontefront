import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { EtatsComponent } from './etats.component';
import { RegistreActionnaireComponent } from './registre-actionnaire/registre-actionnaire.component';
import {DataTablesModule} from "angular-datatables";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import { PortefeuilleComponent } from './portefeuille/portefeuille.component';
import { RelevetitrefcpComponent } from './relevetitrefcp/relevetitrefcp.component';
import { Relevepartfcp } from './relevepartfcp/relevepartfcp';
import { Relevepartactionnaire } from './relevepartactionnaire/relevepartactionnaire';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Journal } from './journal/journal';
import { Soldecomptecomtable } from './soldecomptecomtable/soldecomptecomtable';
import { Balance } from './balance/balance';
import { Balanceavantinventaire } from './balanceavantinventaire/balanceavantinventaire';
import { Souscriptiondetaille } from './souscriptiondetaille/souscriptiondetaille';
import { Souscriptionglobal } from './souscriptionglobal/souscriptionglobal';
import { Rachatdetaille } from './rachatdetaille/rachatdetaille';
import { Rachatglobal } from './rachatglobal/rachatglobal';
import { Bilanannuelf1 } from './bilanannuelf1/bilanannuelf1';
import { Bilanannuelf2 } from './bilanannuelf2/bilanannuelf2';
import { Bilanannuelannexe } from './bilanannuelannexe/bilanannuelannexe';


@NgModule({
  declarations: [
    EtatsComponent,
    RegistreActionnaireComponent,
    PortefeuilleComponent,
    RelevetitrefcpComponent,
    Relevepartfcp,
    Relevepartactionnaire,
    Journal,
    Soldecomptecomtable,
    Balance,
    Balanceavantinventaire,
    Souscriptiondetaille,
    Souscriptionglobal,
    Rachatdetaille,
    Rachatglobal,
    Bilanannuelf1,
    Bilanannuelf2,
    Bilanannuelannexe
  ],
    imports: [
    CommonModule,
    EtatsRoutingModule,
    DataTablesModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule
]
})
export class EtatsModule { }
