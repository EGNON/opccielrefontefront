import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitrescielComponent } from './titresciel.component';
import {RouterModule, Routes} from "@angular/router";
import {CoreComponent} from "../core/core.component";
import {TitrescielRouting} from "./pages/routing";
import { TableauAmortissementComponent } from './pages/modal/tableau-amortissement/tableau-amortissement.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { DateCoursComponent } from './pages/modal/date-cours/date-cours.component';
import {EntityCrudModule} from "../core/modules/entity-crud/entity-crud.module";

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: TitrescielRouting,
  },
];


@NgModule({
  declarations: [
    TitrescielComponent,
    TableauAmortissementComponent,
    DateCoursComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        NgbInputDatepicker,
        EntityCrudModule
    ]
})
export class TitrescielModule { }
