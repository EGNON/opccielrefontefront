import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PaiementrachatComponent} from "./paiementrachat.component";
import {PaiementrachatListComponent} from "./paiementrachat-list/paiementrachat-list.component";


const routes: Routes = [
  {
    path: '',
    component: PaiementrachatComponent,
    children: [
      { path: '', component: PaiementrachatListComponent, } ,
      // { path: 'show/:id', component: IntentionrachatShowComponent, },
      { path: 'Intentionrachat', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementrachatRoutingModule {
}
