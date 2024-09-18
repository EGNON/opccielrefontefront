import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionComponent } from './profession.component';
import { ProfessionAddEditComponent } from './profession-add-edit/profession-add-edit.component';
import { ProfessionListComponent } from './profession-list/profession-list.component';
import { DeleteProfessionModalComponent } from './delete-profession-modal/delete-profession-modal.component';
import { ProfessionShowComponent } from './profession-show/profession-show.component';
import {RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {ProfessionRoutingModule} from "./profession-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    ProfessionComponent,
    ProfessionAddEditComponent,
    ProfessionListComponent,
    DeleteProfessionModalComponent,
    ProfessionShowComponent
  ],
    imports: [
        CommonModule,
        ProfessionRoutingModule,
        ReactiveFormsModule,
        RouterLink,
        SharedModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class ProfessionModule { }
