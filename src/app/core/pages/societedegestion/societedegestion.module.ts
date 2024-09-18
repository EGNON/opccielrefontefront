import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocietedegestionComponent } from './societedegestion.component';
import { SocietedegestionListComponent } from './societedegestion-list/societedegestion-list.component';
import { SocietedegestionAddEditComponent } from './societedegestion-add-edit/societedegestion-add-edit.component';
import { DeleteSocietedegestionModalComponent } from './delete-societedegestion-modal/delete-societedegestion-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {SocieteDeGestionRoutingModule} from "./societedegestion-routing.module";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";



@NgModule({
  declarations: [
    SocietedegestionComponent,
    SocietedegestionListComponent,
    SocietedegestionAddEditComponent,
    DeleteSocietedegestionModalComponent
  ],
    imports: [
        CommonModule,
        RouterOutlet,
        EntityCrudModule,
        SocieteDeGestionRoutingModule,
        SharedModule,
        SweetAlert2Module,
        ReactiveFormsModule,
        RouterLink,
        NgbInputDatepicker,
        NumeroPositifValidatorsDirective
    ]
})
export class SocietedegestionModule { }
