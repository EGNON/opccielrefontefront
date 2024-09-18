import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MailRoutingModule} from "./mail-routing.module";
import {DataTablesModule} from "angular-datatables";
import { MailComponent } from './mail.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailCreateComponent } from './mail-create/mail-create.component';
import { DeleteMailModalComponent } from './delete-mail-modal/delete-mail-modal.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import { MailShowComponent } from './mail-show/mail-show.component';
import {EditorComponent} from "@tinymce/tinymce-angular";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

@NgModule({
  declarations: [


    MailComponent,
         MailListComponent,
         MailCreateComponent,
         DeleteMailModalComponent,
         MailShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        MailRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
        EditorComponent,
        NgMultiSelectDropDownModule,
    ]
})
export class MailModule { }
