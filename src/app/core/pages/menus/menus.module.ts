import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent } from './menus.component';
import { MenusListComponent } from './menus-list/menus-list.component';
import { MenusAddEditComponent } from './menus-add-edit/menus-add-edit.component';
import { MenusShowComponent } from './menus-show/menus-show.component';
import { DeleteMenusModalComponent } from './delete-menus-modal/delete-menus-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";


@NgModule({
  declarations: [
    MenusComponent,
    MenusListComponent,
    MenusAddEditComponent,
    MenusShowComponent,
    DeleteMenusModalComponent
  ],
  imports: [
    CommonModule,
    MenusRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    NgMultiSelectDropDownModule,
    NgbInputDatepicker,
    ReactiveFormsModule
  ]
})
export class MenusModule { }
