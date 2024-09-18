import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {GeldegelRoutingModule} from "./geldegel-routing.module";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { GeldegelComponent } from './geldegel.component';
import { GeldegelAddEditComponent } from './geldegel-add-edit/geldegel-add-edit.component';
import { GeldegelListComponent } from './geldegel-list/geldegel-list.component';
import { GeldegelShowComponent } from './geldegel-show/geldegel-show.component';

@NgModule({
  declarations: [
    GeldegelComponent,
    GeldegelAddEditComponent,
    GeldegelListComponent,
    GeldegelShowComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    GeldegelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    EntityCrudModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
  ]
})
export class GeldegelModule { }
