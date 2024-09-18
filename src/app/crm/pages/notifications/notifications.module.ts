import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { DeleteNotificationsModalComponent } from './delete-notifications-modal/delete-notifications-modal.component';
import { NotificationsShowComponent } from './notifications-show/notifications-show.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationsAddEditComponent } from './notifications-add-edit/notifications-add-edit.component';
import {NgbInputDatepicker, NgbTimepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";
import {EditorComponent} from "@tinymce/tinymce-angular";

@NgModule({
  declarations: [
    NotificationsComponent,
    DeleteNotificationsModalComponent,
    NotificationsShowComponent,
    NotificationsListComponent,
    NotificationsAddEditComponent
  ],
    imports: [
        CommonModule,
        NotificationsRoutingModule,
        SharedModule,
        NgbInputDatepicker,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbTimepicker,
        EntityCrudModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective,
        EditorComponent,
    ]
})
export class NotificationsModule { }
