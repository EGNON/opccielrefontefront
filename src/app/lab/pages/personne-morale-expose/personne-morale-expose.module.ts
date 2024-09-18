import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PersonneMoraleExposeRoutingModule} from "./personne-morale-expose-routing.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {PersonneMoraleExposeComponent} from "./personne-morale-expose.component";
import {
  PersonneMoraleExposeAddEditComponent
} from "./personne-morale-expose-add-edit/personne-morale-expose-add-edit.component";
import {
  DeletePersonneMoraleExposeModalComponent
} from "./delete-personne-morale-expose-modal/delete-personne-morale-expose-modal.component";
import {PersonneMoraleExposeListComponent} from "./personne-morale-expose-list/personne-morale-expose-list.component";
import { PersonneMoraleExposeShowComponent } from './personne-morale-expose-show/personne-morale-expose-show.component';

@NgModule({
  declarations: [
    PersonneMoraleExposeComponent,
    PersonneMoraleExposeListComponent,
    DeletePersonneMoraleExposeModalComponent,
    PersonneMoraleExposeAddEditComponent,
    PersonneMoraleExposeShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        PersonneMoraleExposeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class PersonneMoraleExposeModule { }
