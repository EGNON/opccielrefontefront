import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select2Directive} from "./select2.directive";
import {HasPermissionDirective} from "./auth/has-permission.directive";

@NgModule({
  declarations: [Select2Directive, HasPermissionDirective],
  imports: [
    CommonModule
  ],
  exports: [
    Select2Directive,
    HasPermissionDirective
  ]
})
export class DirectivesModule { }
