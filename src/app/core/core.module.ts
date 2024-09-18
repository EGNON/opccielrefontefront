import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import {RouterModule, Routes} from "@angular/router";
import {CoreRouting} from "./pages/routing";
import { ChangerQualitePersonneComponent } from './pages/modal/changer-qualite-personne/changer-qualite-personne.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: CoreRouting,
  },
];

@NgModule({
  declarations: [
    CoreComponent,
    ChangerQualitePersonneComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NgbInputDatepicker
  ]
})
export class CoreModule { }
