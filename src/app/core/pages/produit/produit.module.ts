import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {ProduitRoutingModule} from "./produit-routing.module";
import { ProduitListComponent } from './produit-list/produit-list.component';
import {ProduitComponent} from "./produit.component";
import { ProduitAddEditComponent } from './produit-add-edit/produit-add-edit.component';
import { ProduitShowComponent } from './produit-show/produit-show.component';
import { DeleteProduitModalComponent } from './delete-produit-modal/delete-produit-modal.component';
import {EntityCrudModule} from "../../modules/entity-crud/entity-crud.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    ProduitComponent,
         ProduitListComponent,
         ProduitAddEditComponent,
         ProduitShowComponent,
         DeleteProduitModalComponent,
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        ProduitRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CardsModule,
        DataTablesModule,
        EntityCrudModule,
        SweetAlert2Module,
    ]
})
export class ProduitModule { }
