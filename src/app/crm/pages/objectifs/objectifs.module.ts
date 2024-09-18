import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectifsRoutingModule } from './objectifs-routing.module';
import { ObjectifsListComponent } from './objectifs-list/objectifs-list.component';
import { ObjectifsComponent } from './objectifs.component';
import { ObjectifsAddEditComponent } from './objectifs-add-edit/objectifs-add-edit.component';
import { ObjectifsShowComponent } from './objectifs-show/objectifs-show.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker, NgbTimepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import { DeleteObjectifsModalComponent } from './delete-objectifs-modal/delete-objectifs-modal.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";

@NgModule({
  declarations: [
    ObjectifsListComponent,
    ObjectifsComponent,
    ObjectifsAddEditComponent,
    ObjectifsShowComponent,
    DeleteObjectifsModalComponent,
  ],
    imports: [
        CommonModule,
        ObjectifsRoutingModule,
        SharedModule,
        NgMultiSelectDropDownModule,
        NgbInputDatepicker,
        NgbTimepicker,
        ReactiveFormsModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class ObjectifsModule { }
