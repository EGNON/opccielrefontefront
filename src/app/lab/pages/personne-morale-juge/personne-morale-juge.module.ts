import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PersonneMoraleJugeRoutingModule} from "./personne-morale-juge-routing.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {PersonneMoraleJugeComponent} from "./personne-morale-juge.component";
import {PersonneMoraleJugeListComponent} from "./personne-morale-juge-list/personne-morale-juge-list.component";
import {
  DeletePersonneMoraleJugeModalComponent
} from "./delete-personne-morale-juge-modal/delete-personne-morale-juge-modal.component";
import {
  PersonneMoraleJugeAddEditComponent
} from "./personne-morale-juge-add-edit/personne-morale-juge-add-edit.component";
import { PersonneMoraleJugeShowComponent } from './personne-morale-juge-show/personne-morale-juge-show.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule({
  declarations: [
    PersonneMoraleJugeComponent,
    PersonneMoraleJugeListComponent,
    DeletePersonneMoraleJugeModalComponent,
    PersonneMoraleJugeAddEditComponent,
    PersonneMoraleJugeShowComponent
  ],
    imports: [
    CommonModule,
    WidgetsModule,
    PersonneMoraleJugeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    EntityCrudModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule
]
})
export class PersonneMoraleJugeModule { }
