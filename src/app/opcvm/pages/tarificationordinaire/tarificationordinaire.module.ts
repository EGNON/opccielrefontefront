import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarificationordinaireComponent } from './tarificationordinaire.component';
import { TarificationordinaireListComponent } from './tarificationordinaire-list/tarificationordinaire-list.component';
import { TarificationordinaireAddEditComponent } from './tarificationordinaire-add-edit/tarificationordinaire-add-edit.component';
import { DeleteTarificationordinaireModalComponent } from './delete-tarificationordinaire-modal/delete-tarificationordinaire-modal.component';
import {RouterOutlet} from "@angular/router";
import {TarificationordinaireRoutingModule} from "./tarificationordinaire-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {NombreDecimalDirective} from "../../../validators/nombre-decimal.directive";



@NgModule({
  declarations: [
    TarificationordinaireComponent,
    TarificationordinaireListComponent,
    TarificationordinaireAddEditComponent,
    DeleteTarificationordinaireModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    TarificationordinaireRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    NgbInputDatepicker,
    ReactiveFormsModule,
    NombreDecimalDirective
  ]
})
export class TarificationordinaireModule { }
