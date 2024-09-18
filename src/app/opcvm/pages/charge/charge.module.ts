import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargeComponent } from './charge.component';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeAddEditComponent } from './charge-add-edit/charge-add-edit.component';
import { DeleteChargeModalComponent } from './delete-charge-modal/delete-charge-modal.component';
import {ChargeRoutingModule} from "./charge-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ChargeComponent,
    ChargeListComponent,
    ChargeAddEditComponent,
    DeleteChargeModalComponent
  ],
  imports: [
    CommonModule,
    ChargeRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    NombreDecimalDirective,
    ReactiveFormsModule
  ]
})
export class ChargeModule { }
