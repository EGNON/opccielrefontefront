import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sanctiononu } from './sanctiononu';
import { SanctiononuList } from './sanctiononu-list/sanctiononu-list';
import { SanctionRoutingModule } from './sanctiononu-routing.module';



@NgModule({
  declarations: [
    Sanctiononu,
    SanctiononuList
  ],
  imports: [
    CommonModule,
    SanctionRoutingModule
  ]
})
export class SanctiononuModule { }
