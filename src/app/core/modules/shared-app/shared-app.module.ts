import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserNotificationsComponent} from "./user-notifications/user-notifications.component";
// import { PrintLayoutComponent } from './print-layout/print-layout.component';
import {FormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";

@NgModule({
  declarations: [UserNotificationsComponent],
  exports: [
    UserNotificationsComponent,
    // PrintLayoutComponent

  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterOutlet
    ]
})
export class SharedAppModule { }
