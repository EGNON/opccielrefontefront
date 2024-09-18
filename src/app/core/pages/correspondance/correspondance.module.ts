import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrespondanceComponent } from './correspondance.component';
import { CorrespondanceListComponent } from './correspondance-list/correspondance-list.component';
import { CorrespondanceAddEditComponent } from './correspondance-add-edit/correspondance-add-edit.component';
import { DeleteCorrespondanceModalComponent } from './delete-correspondance-modal/delete-correspondance-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CorrespondanceRoutingModule} from "./correspondance-routing.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CorrespondanceComponent,
    CorrespondanceListComponent,
    CorrespondanceAddEditComponent,
    DeleteCorrespondanceModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    CorrespondanceRoutingModule,
    NumeroPositifValidatorsDirective,
    ReactiveFormsModule
  ]
})
export class CorrespondanceModule { }
