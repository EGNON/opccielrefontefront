import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {TypedocumentComponent} from "./typedocument.component";
import {TypedocumentListComponent} from "./typedocument-list/typedocument-list.component";
import {TypedocumentCreateComponent} from "./typedocument-create/typedocument-create.component";
import {TypedocumentRoutingModule} from "./typedocument-routing.module";
import { DeleteTypedocumentModalComponent } from './delete-typedocument-modal/delete-typedocument-modal.component';
import { TypedocumentAddEditComponent } from './typedocument-add-edit/typedocument-add-edit.component';
import { TypedocumentShowComponent } from './typedocument-show/typedocument-show.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    TypedocumentComponent,
    TypedocumentListComponent,
    TypedocumentCreateComponent,
    DeleteTypedocumentModalComponent,
    TypedocumentAddEditComponent,
    TypedocumentShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        TypedocumentRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class TypedocumentModule{ }
