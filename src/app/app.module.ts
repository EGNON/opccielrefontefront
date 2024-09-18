import {NgModule, APP_INITIALIZER, LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import {NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {AuthService} from "./core/modules/auth";
import {AppHttpInterceptor} from "./core/interceptors/app-http.interceptor";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbCustomDateParserFormatter} from "./formatters/ngb-custom-date-parser-formatter";
import {NgApexchartsModule} from "ng-apexcharts";
import {APP_BASE_HREF, registerLocaleData} from "@angular/common";
import * as fr from '@angular/common/locales/fr';
import {UniqueNumCpteDepositValidators} from "./validators/unique-num-cpte-deposit-validators";
import {DirectivesModule} from "./directives/directives.module";
import {DataTablesModule} from "angular-datatables";
import { SpinnerComponent } from './spinner/spinner.component';
import {LoadingInterceptor} from "./loading.interceptor";

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve, reject) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
      //authService.getCurrentOpcvm().subscribe(()=>resolve,err=>reject(err));
    });
  };
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgApexchartsModule,
    DirectivesModule,
    DataTablesModule
  ],
  providers: [
    UniqueNumCpteDepositValidators,
    NgbActiveModal,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    // { provide: NgbDateAdapter, useClass: NgbCustomDateAdapter },
    {provide: NgbDateParserFormatter, useClass: NgbCustomDateParserFormatter},
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
