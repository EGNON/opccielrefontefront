import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecteurboursierComponent } from './secteurboursier.component';
import { SecteurboursierListComponent } from './secteurboursier-list/secteurboursier-list.component';
import { SecteurboursierAddEditComponent } from './secteurboursier-add-edit/secteurboursier-add-edit.component';
import { DeleteSecteurboursierModalComponent } from './delete-secteurboursier-modal/delete-secteurboursier-modal.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ReactiveFormsModule} from "@angular/forms";
import {SecteurboursierRoutingModule} from "./secteurboursier-routing.module";



@NgModule({
  declarations: [
    SecteurboursierComponent,
    SecteurboursierListComponent,
    SecteurboursierAddEditComponent,
    DeleteSecteurboursierModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    EntityCrudModule,
    SharedModule,
    SecteurboursierRoutingModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class SecteurboursierModule { }
