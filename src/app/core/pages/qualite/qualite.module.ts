import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {QualiteRoutingModule} from "./qualite-routing.module";
import {QualiteComponent} from "./qualite.component";
import { QualiteListComponent } from './qualite-list/qualite-list.component';
import { DeleteQualiteModalComponent } from './delete-qualite-modal/delete-qualite-modal.component';
import { QualiteShowComponent } from './qualite-show/qualite-show.component';
import { QualiteAddEditComponent } from './qualite-add-edit/qualite-add-edit.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
    declarations: [
      QualiteComponent,
      QualiteListComponent,
      DeleteQualiteModalComponent,
      QualiteShowComponent,
      QualiteAddEditComponent,
    ],
    imports: [
        CommonModule,
        WidgetsModule,
        QualiteRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class QualiteModule { }
