import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelComponent } from './personnel.component';
import {RouterOutlet} from "@angular/router";
import { PersonnelListComponent } from './personnel-list/personnel-list.component';
import { PersonnelAddEditComponent } from './personnel-add-edit/personnel-add-edit.component';
import { PersonnelShowComponent } from './personnel-show/personnel-show.component';
import {PersonnelRoutingModule} from "./personnel-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";



@NgModule({
  declarations: [
    PersonnelComponent,
    PersonnelListComponent,
    PersonnelAddEditComponent,
    PersonnelShowComponent
  ],
    imports: [
        CommonModule,
        PersonnelRoutingModule,
        RouterOutlet,
        EntityCrudModule,
        SharedModule,
        SweetAlert2Module,
        NgbInputDatepicker,
        ReactiveFormsModule,
        NumeroPositifValidatorsDirective
    ]
})
export class PersonnelModule { }
