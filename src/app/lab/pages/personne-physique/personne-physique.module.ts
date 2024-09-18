import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PersonnePhysiqueRoutingModule} from "./personne-physique-routing.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {PersonnePhysiqueAddEditComponent} from "./personne-physique-add-edit/personne-physique-add-edit.component";
import {PersonnePhysiqueListComponent} from "./personne-physique-list/personne-physique-list.component";
import {PersonnePhysiqueShowComponent} from "./personne-physique-show/personne-physique-show.component";
import {PersonnePhysiqueComponent} from "./personne-physique.component";
import {
  DeletePersonnePhysiqueModaleComponent
} from "./delete-personne-physique-modale/delete-personne-physique-modale.component";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    PersonnePhysiqueComponent,
    PersonnePhysiqueListComponent,
    DeletePersonnePhysiqueModaleComponent,
    PersonnePhysiqueAddEditComponent,
    PersonnePhysiqueShowComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    PersonnePhysiqueRoutingModule,
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
export class PersonnePhysiqueModule { }
