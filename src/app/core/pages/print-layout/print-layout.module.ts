import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintLayoutRoutingModule } from './print-layout-routing.module';
import { PrintLayoutComponent } from './print-layout.component';
import { PrintSecteurComponent } from './reportings/print-secteur/print-secteur.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedAppModule} from "../../modules/shared-app/shared-app.module";


@NgModule({
  declarations: [
    PrintLayoutComponent,
    PrintSecteurComponent
  ],
  imports: [
    CommonModule,
    PrintLayoutRoutingModule,
    ReactiveFormsModule,
    SharedAppModule
  ]
})
export class PrintLayoutModule { }
