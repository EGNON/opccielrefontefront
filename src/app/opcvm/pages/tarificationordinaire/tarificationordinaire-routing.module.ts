import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TarificationordinaireComponent} from "./tarificationordinaire.component";
import {TarificationordinaireListComponent} from "./tarificationordinaire-list/tarificationordinaire-list.component";
import {TarificationordinaireAddEditComponent} from "./tarificationordinaire-add-edit/tarificationordinaire-add-edit.component";

const routes: Routes = [
  {
    path: ':qualite',
    component: TarificationordinaireComponent,
    children: [
      { path: '', component: TarificationordinaireListComponent, } ,
      { path: 'new', component: TarificationordinaireAddEditComponent, },
      { path: 'edit/:id', component: TarificationordinaireAddEditComponent, },
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
export class TarificationordinaireRoutingModule {
}
