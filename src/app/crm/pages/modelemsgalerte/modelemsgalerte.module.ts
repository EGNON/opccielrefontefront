import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {ModelemsgalerteRoutingModule} from "./modelemsgalerte-routing.module";
import { ModelemsgalerteComponent } from './modelemsgalerte.component';
import { ModelemsgalerteListComponent } from './modelemsgalerte-list/modelemsgalerte-list.component';
import { ModelemsgalerteCreateComponent } from './modelemsgalerte-create/modelemsgalerte-create.component';
import { DeleteModalModelemsgalerteComponent } from './delete-modal-modelemsgalerte/delete-modal-modelemsgalerte.component';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {EditorComponent} from "@tinymce/tinymce-angular";


@NgModule({
  declarations: [


    ModelemsgalerteComponent,
         ModelemsgalerteListComponent,
         ModelemsgalerteCreateComponent,
         DeleteModalModelemsgalerteComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    ModelemsgalerteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    EntityCrudModule,
    SweetAlert2Module,
    EditorComponent,

  ]
})
export class ModelemsgalerteModule { }
