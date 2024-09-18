import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanqueComponent } from './banque.component';
import { BanqueListComponent } from './banque-list/banque-list.component';
import { BanqueAddEditComponent } from './banque-add-edit/banque-add-edit.component';
import { DeleteBanqueModalComponent } from './delete-banque-modal/delete-banque-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BanqueRoutingModule} from "./banque-routing.module";



@NgModule({
  declarations: [
    BanqueComponent,
    BanqueListComponent,
    BanqueAddEditComponent,
    DeleteBanqueModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    BanqueRoutingModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class BanqueModule { }
