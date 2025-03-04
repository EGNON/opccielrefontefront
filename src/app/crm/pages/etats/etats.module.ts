import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EtatsRoutingModule} from "./etats-routing.module";
import {DataTablesModule} from "angular-datatables";
import { RdvPrintComponent } from './rdv-print/rdv-print.component';
import { EtatsComponent } from './etats.component';
import {NgxPrintModule} from "ngx-print";
import { ProspectPrintComponent } from './prospect-print/prospect-print.component';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbInputDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { ClientPrintComponent } from './client-print/client-print.component';
import { CompterenduPrintComponent } from './compterendu-print/compterendu-print.component';
import { ProduitsouscritPrintComponent } from './produitsouscrit-print/produitsouscrit-print.component';
import { FichekycPrintComponent } from './fichekyc-print/fichekyc-print.component';
import { ClientnayantinvestiComponent } from './clientnayantinvesti/clientnayantinvesti.component';
import { ObjectifPrintComponent } from './objectif-print/objectif-print.component';
import { TestPrintComponent } from './test-print/test-print.component';
import { TestPrint2Component } from './test-print-2/test-print-2.component';
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import { ClientPrint2Component } from './client-print2/client-print2.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

@NgModule({
  declarations: [

    RdvPrintComponent,
       EtatsComponent,
       ProspectPrintComponent,
       ClientPrintComponent,
       CompterenduPrintComponent,
       ProduitsouscritPrintComponent,
       FichekycPrintComponent,
       ClientnayantinvestiComponent,
       ObjectifPrintComponent,
       TestPrintComponent,
       TestPrint2Component,
       ClientPrint2Component
  ],
    imports: [
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
        NgMultiSelectDropDownModule
    ]
})
export class EtatsModule { }
