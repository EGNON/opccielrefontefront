import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PersonnePhysiqueJugeRoutingModule} from "./personne-physique-juge-routing.module";
import {PersonnePhysiqueJugeComponent} from "./personne-physique-juge.component";
import {PersonnePhysiqueJugeListComponent} from "./personne-physique-juge-list/personne-physique-juge-list.component";
import {
  DeletePersonnePhysiqueJugeModalComponent
} from "./delete-personne-physique-juge-modal/delete-personne-physique-juge-modal.component";
import {
  PersonnePhysiqueJugeAddEditComponent
} from "./personne-physique-juge-add-edit/personne-physique-juge-add-edit.component";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { PersonnePhysiqueJugeShowComponent } from './personne-physique-juge-show/personne-physique-juge-show.component';

@NgModule({
  declarations: [
    PersonnePhysiqueJugeComponent,
    PersonnePhysiqueJugeListComponent,
    DeletePersonnePhysiqueJugeModalComponent,
    PersonnePhysiqueJugeAddEditComponent,
    PersonnePhysiqueJugeShowComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    PersonnePhysiqueJugeRoutingModule,
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
export class PersonnePhysiqueJugeModule { }
