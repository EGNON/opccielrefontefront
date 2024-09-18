import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilcommissionsousrachComponent } from './profilcommissionsousrach.component';
import { ProfilcommissionsousrachListComponent } from './profilcommissionsousrach-list/profilcommissionsousrach-list.component';
import { ProfilcommissionsousrachAddEditComponent } from './profilcommissionsousrach-add-edit/profilcommissionsousrach-add-edit.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ProfilcommissionsousrachRoutingModule} from "./profilcommissionsousrach-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import { DeleteProfilcommissionsousrachModalComponent } from './delete-profilcommissionsousrach-modal/delete-profilcommissionsousrach-modal.component';



@NgModule({
  declarations: [
    ProfilcommissionsousrachComponent,
    ProfilcommissionsousrachListComponent,
    ProfilcommissionsousrachAddEditComponent,
    DeleteProfilcommissionsousrachModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    ProfilcommissionsousrachRoutingModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    NumeroPositifValidatorsDirective,
    NombreDecimalDirective
  ]
})
export class ProfilcommissionsousrachModule { }
