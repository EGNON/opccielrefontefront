import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import {OverviewComponent} from "./overview/overview.component";
import {SettingsComponent} from "./settings/settings.component";
import {ProfileDetailsComponent} from "./settings/forms/profile-details/profile-details.component";
import {SignInMethodComponent} from "./settings/forms/sign-in-method/sign-in-method.component";
import {ConnectedAccountsComponent} from "./settings/forms/connected-accounts/connected-accounts.component";
import {EmailPreferencesComponent} from "./settings/forms/email-preferences/email-preferences.component";
import {NotificationsComponent} from "./settings/forms/notifications/notifications.component";
import {DeactivateAccountComponent} from "./settings/forms/deactivate-account/deactivate-account.component";
import {ProfileComponent} from "./profile.component";
import {SharedModule} from "../../../../template/_metronic/shared/shared.module";
import {DropdownMenusModule, WidgetsModule} from "../../../../template/_metronic/partials";

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    SettingsComponent,
    ProfileDetailsComponent,
    SignInMethodComponent,
    ConnectedAccountsComponent,
    EmailPreferencesComponent,
    NotificationsComponent,
    DeactivateAccountComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    WidgetsModule,
    DropdownMenusModule
  ]
})
export class ProfileModule { }
