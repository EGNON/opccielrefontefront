import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PermissionListingComponent } from './permission-listing/permission-listing.component';
import { PermissionDetailsComponent } from './permission-details/permission-details.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {CrudModule} from "../../../template/modules/crud/crud.module";

@NgModule({
  declarations: [PermissionListingComponent, PermissionDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PermissionListingComponent,
      },
      {
        path: ':id',
        component: PermissionDetailsComponent,
      },
    ]),
    EntityCrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    CrudModule,
  ]
})
export class PermissionModule { }
