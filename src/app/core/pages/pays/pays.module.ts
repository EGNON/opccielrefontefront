import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {PaysComponent} from "./pays.component";
import {PaysListComponent} from "./pays-list/pays-list.component";
import {PaysRoutingModule} from "./pays-routing.module";
import { DeletePaysModalComponent } from './delete-pays-modal/delete-pays-modal.component';
import { PaysAddEditComponent } from './pays-add-edit/pays-add-edit.component';
import { PaysShowComponent } from './pays-show/pays-show.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {NumeroPositifValidatorsDirective} from "../../../validators/numero-positif-validators.directive";

@NgModule({
  declarations: [
    PaysComponent,
    PaysListComponent,
    DeletePaysModalComponent,
    PaysAddEditComponent,
    PaysShowComponent
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        PaysRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
        NumeroPositifValidatorsDirective,
    ]
})
export class PaysModule { }
