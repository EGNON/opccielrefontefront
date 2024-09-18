import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecteurComponent } from './secteur.component';
import { SecteurListComponent } from './secteur-list/secteur-list.component';
import { SecteurAddEditComponent } from './secteur-add-edit/secteur-add-edit.component';
import {RouterLink} from "@angular/router";
import { DeleteSecteurModalComponent } from './delete-secteur-modal/delete-secteur-modal.component';
import { SecteurShowComponent } from './secteur-show/secteur-show.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SecteurRoutingModule} from "./secteur-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    SecteurComponent,
    SecteurListComponent,
    SecteurAddEditComponent,
    DeleteSecteurModalComponent,
    SecteurShowComponent
  ],
    imports: [
        CommonModule,
        SecteurRoutingModule,
        ReactiveFormsModule,
        RouterLink,
        SharedModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class SecteurModule { }
