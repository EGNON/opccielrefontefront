import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangueComponent } from './langue.component';
import { LangueListComponent } from './langue-list/langue-list.component';
import { LangueAddEditComponent } from './langue-add-edit/langue-add-edit.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {LangueRoutingModule} from "./langue-routing.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {ReactiveFormsModule} from "@angular/forms";
import { DeleteLangueModalComponent } from './delete-langue-modal/delete-langue-modal.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";



@NgModule({
  declarations: [
    LangueComponent,
    LangueListComponent,
    LangueAddEditComponent,
    DeleteLangueModalComponent
  ],
    imports: [
        CommonModule,
        EntityCrudModule,
        SharedModule,
        LangueRoutingModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule
    ]
})
export class LangueModule { }
