import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalAddEditComponent } from './journal-add-edit/journal-add-edit.component';
import { DeleteJournalModalComponent } from './delete-journal-modal/delete-journal-modal.component';
import {RouterOutlet} from "@angular/router";
import {JournalRoutingModule} from "./journal-routing.module";
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    JournalComponent,
    JournalListComponent,
    JournalAddEditComponent,
    DeleteJournalModalComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    JournalRoutingModule,
    EntityCrudModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JournalModule { }
