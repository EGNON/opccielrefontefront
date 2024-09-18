import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriterealerteComponent } from './criterealerte.component';
import { CriterealerteAddEditComponent } from './criterealerte-add-edit/criterealerte-add-edit.component';
import { CriterealerteListComponent } from './criterealerte-list/criterealerte-list.component';
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CritereAlerteRoutingModule} from "./criterealerte-routing.module";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import { DeleteCriterealerteModalComponent } from './delete-criterealerte-modal/delete-criterealerte-modal.component';



@NgModule({
  declarations: [
    CriterealerteComponent,
    CriterealerteAddEditComponent,
    CriterealerteListComponent,
    DeleteCriterealerteModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    CritereAlerteRoutingModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class CriterealerteModule { }
