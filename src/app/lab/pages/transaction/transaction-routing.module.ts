import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TransactionComponent} from "./transaction.component";
import {TransactionListComponent} from "./transaction-list/transaction-list.component";


const routes: Routes = [
  {
    path: '',
    component: TransactionComponent,
    children: [
      { path: '', component: TransactionListComponent, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {
}
