import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbrubriquepositionComponent } from './ibrubriqueposition.component';
import { IbrubriquepositionListComponent } from './ibrubriqueposition-list/ibrubriqueposition-list.component';
import { IbrubriquepositionAddEditComponent } from './ibrubriqueposition-add-edit/ibrubriqueposition-add-edit.component';
import { DeleteIbrubriquepositionModalComponent } from './delete-ibrubriqueposition-modal/delete-ibrubriqueposition-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {RouterOutlet} from "@angular/router";
import {IbrubriquepositionRoutingModule} from "./ibrubriqueposition-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";



@NgModule({
  declarations: [
    IbrubriquepositionComponent,
    IbrubriquepositionListComponent,
    IbrubriquepositionAddEditComponent,
    DeleteIbrubriquepositionModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    IbrubriquepositionRoutingModule,
    RouterOutlet,
    ReactiveFormsModule,
    NumeroPositifValidatorsDirective
  ]
})
export class IbrubriquepositionModule { }
