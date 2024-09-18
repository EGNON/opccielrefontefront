import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProduitListComponent} from "./produit-list/produit-list.component";
import {ProduitComponent} from "./produit.component";
import {ProduitAddEditComponent} from "./produit-add-edit/produit-add-edit.component";
import {ProduitShowComponent} from "./produit-show/produit-show.component";

const routes: Routes = [
  {
    path: '',
    component: ProduitComponent,
    children: [
      { path: '', component: ProduitListComponent, },
      { path: 'new', component: ProduitAddEditComponent, },
      { path: 'edit/:id', component: ProduitAddEditComponent, },
      { path: 'show/:id', component: ProduitShowComponent, },
      { path: 'produit', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProduitRoutingModule {
}
