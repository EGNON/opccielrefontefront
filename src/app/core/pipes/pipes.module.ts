import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAsAgoPipe } from './date-as-ago.pipe';

@NgModule({
  declarations: [
    DateAsAgoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DateAsAgoPipe
  ]
})
export class PipesModule { }
