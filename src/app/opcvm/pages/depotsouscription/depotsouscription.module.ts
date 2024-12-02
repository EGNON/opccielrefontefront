import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepotsouscriptionRoutingModule } from './depotsouscription-routing.module';
import { DepotsouscriptionComponent } from './depotsouscription.component';
import { DepotsouscriptionListComponent } from './depotsouscription-list/depotsouscription-list.component';
import { DepotsouscriptionAddEditComponent } from './depotsouscription-add-edit/depotsouscription-add-edit.component';
import { DepotsouscriptionGenerateComponent } from './depotsouscription-generate/depotsouscription-generate.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker, NgbTimepicker} from "@ng-bootstrap/ng-bootstrap";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import { DeleteDepotsouscriptionModalComponent } from './delete-depotsouscription-modal/delete-depotsouscription-modal.component';
import { VerifDepotsouscriptionReportComponent } from './verif-depotsouscription-report/verif-depotsouscription-report.component';
import {DataTablesModule} from "angular-datatables";
import { VerifDepotsouscriptionNiv1Component } from './verif-depotsouscription-niv1/verif-depotsouscription-niv1.component';
import { VerifDepotsouscriptionNiv2Component } from './verif-depotsouscription-niv2/verif-depotsouscription-niv2.component';
import { RestitutionReliquatComponent } from './restitution-reliquat/restitution-reliquat.component';
import { ListeSeanceOpcvmComponent } from './modal/liste-seance-opcvm/liste-seance-opcvm.component';


@NgModule({
  declarations: [
    DepotsouscriptionComponent,
    DepotsouscriptionListComponent,
    DepotsouscriptionAddEditComponent,
    DepotsouscriptionGenerateComponent,
    DeleteDepotsouscriptionModalComponent,
    VerifDepotsouscriptionReportComponent,
    VerifDepotsouscriptionNiv1Component,
    VerifDepotsouscriptionNiv2Component,
    RestitutionReliquatComponent,
    ListeSeanceOpcvmComponent
  ],
    imports: [
        CommonModule,
        DepotsouscriptionRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        EditorComponent,
        FormsModule,
        NgbInputDatepicker,
        NgbTimepicker,
        NumeroPositifValidatorsDirective,
        ReactiveFormsModule,
        DataTablesModule
    ]
})
export class DepotsouscriptionModule { }
