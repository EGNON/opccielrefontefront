import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {VdeComponent} from "./vde.component";
import {OperationextournevdeComponent} from "./operationextournevde/operationextournevde.component";
import {
  OperationextournevdeAddEditComponent
} from "./operationextournevde-add-edit/operationextournevde-add-edit.component";
import {Verificationniveau1vdeComponent} from "./verificationniveau1vde/verificationniveau1vde.component";
import {
  Verificationniveau1modalvdeComponent
} from "./verificationniveau1modalvde/verificationniveau1modalvde.component";
import {
  Verificationniveau2modalvdeComponent
} from "./verificationniveau2modalvde/verificationniveau2modalvde.component";
import {
  Verificationextourneniveau1modalvdeComponent
} from "./verificationextourneniveau1modalvde/verificationextourneniveau1modalvde.component";
import {
  Verificationextourneniveau2modalvdeComponent
} from "./verificationextourneniveau2modalvde/verificationextourneniveau2modalvde.component";
import {SoldecompteextourneComponent} from "./soldecompteextourne/soldecompteextourne.component";

const routes: Routes = [
  {
    path: '',
    component: VdeComponent,
    children: [
      { path: 'generationextourne/liste', component: OperationextournevdeComponent, } ,
      { path: 'generationextourne/afficher/:id', component: OperationextournevdeAddEditComponent, } ,
      { path: 'generationextourne/liste/verification/niveau1', component: Verificationniveau1modalvdeComponent, } ,
      { path: 'generationextourne/liste/verification/niveau2', component: Verificationniveau2modalvdeComponent, } ,
      { path: 'generationextourne/liste/verificationextourne/niveau1', component: Verificationextourneniveau1modalvdeComponent, } ,
      { path: 'generationextourne/liste/verificationextourne/niveau2', component: Verificationextourneniveau2modalvdeComponent, } ,
      { path: 'generationextourne/liste/soldecompteextourne', component: SoldecompteextourneComponent, } ,
      // { path: 'show/:id', component: TarificationordinaireShowComponent, },
      { path: 'Tarificationordinaire', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VdeRoutingModule {
}
