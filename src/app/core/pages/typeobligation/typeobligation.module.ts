import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeobligationComponent } from './typeobligation.component';
import { TypeobligationListComponent } from './typeobligation-list/typeobligation-list.component';
import { TypeobligationAddEditComponent } from './typeobligation-add-edit/typeobligation-add-edit.component';
import { DeleteTypeobligationModalComponent } from './delete-typeobligation-modal/delete-typeobligation-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {TypeobligationRoutingModule} from "./typeobligation-routing.module";



@NgModule({
  declarations: [
    TypeobligationComponent,
    TypeobligationListComponent,
    TypeobligationAddEditComponent,
    DeleteTypeobligationModalComponent
  ],
  imports: [
    CommonModule,
    EntityCrudModule,
    TypeobligationRoutingModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet
  ]
})
export class TypeobligationModule { }
