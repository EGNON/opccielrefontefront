import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatsRoutingModule } from './etats-routing.module';
import { EtatsComponent } from './etats.component';


@NgModule({
  declarations: [
    EtatsComponent
  ],
  imports: [
    CommonModule,
    EtatsRoutingModule
  ]
})
export class EtatsModule { }
