import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModeleecritureComponent} from "./modeleecriture.component";
import {ModeleecritureListComponent} from "./modeleecriture-list/modeleecriture-list.component";
import {ModeleecritureAddEditComponent} from "./modeleecriture-add-edit/modeleecriture-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: ModeleecritureComponent,
    children: [
      { path: '', component: ModeleecritureListComponent, },
      { path: 'new', component: ModeleecritureAddEditComponent, },
      { path: 'edit/:id/:id2/:id3', component: ModeleecritureAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Modeleecriture', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeleecritureRoutingModule { }
