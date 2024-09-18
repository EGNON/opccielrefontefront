import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceComponent } from './place.component';
import { DeletePlaceModalComponent } from './delete-place-modal/delete-place-modal.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { PlaceAddEditComponent } from './place-add-edit/place-add-edit.component';
import {RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {PlaceRoutingModule} from "./place-routing.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    PlaceComponent,
    DeletePlaceModalComponent,
    PlaceListComponent,
    PlaceAddEditComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    PlaceRoutingModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule
  ]
})
export class PlaceModule { }
