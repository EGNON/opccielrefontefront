import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {CompterenduRoutingModule} from "./compterendu-routing.module";
import { CompterenduComponent } from './compterendu.component';
import { CompterenduListComponent } from './compterendu-list/compterendu-list.component';
import { CompterenduShowComponent } from './compterendu-show/compterendu-show.component';
import { CompterenduAddEditComponent } from './compterendu-add-edit/compterendu-add-edit.component';
import { DeleteCompterenduModalComponent } from './delete-compterendu-modal/delete-compterendu-modal.component';
import {
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu, NgbDropdownToggle,
    NgbInputDatepicker,
    NgbTimepicker
} from "@ng-bootstrap/ng-bootstrap";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, DropdownMenusModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {CrudModule} from "../../../template/modules/crud/crud.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {EditorComponent} from "@tinymce/tinymce-angular";

@NgModule({
  declarations: [
       CompterenduComponent,
       CompterenduListComponent,
       CompterenduShowComponent,
       CompterenduAddEditComponent,
       DeleteCompterenduModalComponent,
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        CompterenduRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        NgbInputDatepicker,
        DropdownMenusModule,
        NgbTimepicker,
        NgbDropdown,
        NgbDropdownItem,
        NgbDropdownMenu,
        NgbDropdownToggle,
        CrudModule,
        EntityCrudModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective,
        EditorComponent,
    ]
})
export class CompterenduModule { }
