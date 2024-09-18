import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {RdvComponent} from "./rdv.component";
import {RdvListComponent} from "./rdv-list/rdv-list.component";
import {RdvCreateComponent} from "./rdv-create/rdv-create.component";
import {RdvRoutingModule} from "./rdv-routing.module";
import { DeleteRdvModalComponent } from './delete-rdv-modal/delete-rdv-modal.component';
import { RdvUpdateComponent } from './rdv-update/rdv-update.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import { RdvAddEditComponent } from './rdv-add-edit/rdv-add-edit.component';
import {MatInputModule} from "@angular/material/input";
import {TranslateModule} from "@ngx-translate/core";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { RdvShowComponent } from './rdv-show/rdv-show.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

@NgModule({
  declarations: [
    RdvComponent,
    RdvListComponent,
    RdvCreateComponent,
    DeleteRdvModalComponent,
    RdvUpdateComponent,
    RdvAddEditComponent,
    RdvShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        RdvRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
        EditorComponent,
        NgxMaterialTimepickerModule,
        MatInputModule,
        TranslateModule,
        NgbInputDatepicker,
        NgMultiSelectDropDownModule
    ]
})
export class RDVModule { }
