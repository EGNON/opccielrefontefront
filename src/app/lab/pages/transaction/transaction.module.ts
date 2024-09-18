import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import {RouterOutlet} from "@angular/router";
import {TransactionRoutingModule} from "./transaction-routing.module";
import {EntityCrudModule} from "../../../core/modules/entity-crud/entity-crud.module";
import {SharedModule} from "../../../template/_metronic/shared/shared.module";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CardsModule, WidgetsModule} from "../../../template/_metronic/partials";
import {DataTablesModule} from "angular-datatables";
import {PersonnePhysiqueJugeRoutingModule} from "../personne-physique-juge/personne-physique-juge-routing.module";



@NgModule({
  declarations: [
    TransactionComponent,
    TransactionListComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    TransactionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CardsModule,
    DataTablesModule,
    EntityCrudModule,
    SweetAlert2Module,

  ]
})
export class TransactionModule { }
