import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorieComponent } from './categorie.component';
import { CategorieAddEditComponent } from './categorie-add-edit/categorie-add-edit.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { CategorieShowComponent } from './categorie-show/categorie-show.component';
import {CategorieRoutingModule} from "./categorie-routing.module";
import {DataTablesModule} from "angular-datatables";
import { DeleteCategorieModalComponent } from './delete-categorie-modal/delete-categorie-modal.component';
import {InlineSVGModule} from "ng-inline-svg-2";
import {ReactiveFormsModule} from "@angular/forms";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";

@NgModule({
  declarations: [
    CategorieComponent,
    CategorieAddEditComponent,
    CategorieListComponent,
    CategorieShowComponent,
    DeleteCategorieModalComponent
  ],
    imports: [
        CommonModule,
        CategorieRoutingModule,
        DataTablesModule,
        InlineSVGModule,
        SharedModule,
        ReactiveFormsModule,
        EntityCrudModule,
        SweetAlert2Module
    ]
})
export class CategorieModule {}
