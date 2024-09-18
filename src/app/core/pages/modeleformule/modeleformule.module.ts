import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeleformuleComponent } from './modeleformule.component';
import { ModeleformuleListComponent } from './modeleformule-list/modeleformule-list.component';
import { ModeleformuleAddEditComponent } from './modeleformule-add-edit/modeleformule-add-edit.component';
import { DeleteModeleformuleModalComponent } from './delete-modeleformule-modal/delete-modeleformule-modal.component';
import {ModeleformuleRoutingModule} from "./modeleformule-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";



@NgModule({
  declarations: [
    ModeleformuleComponent,
    ModeleformuleListComponent,
    ModeleformuleAddEditComponent,
    DeleteModeleformuleModalComponent
  ],
    imports: [
        CommonModule,
        ModeleformuleRoutingModule,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule
    ]
})
export class ModeleformuleModule { }
