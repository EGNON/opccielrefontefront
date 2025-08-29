import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HistoriqueactionnaireComponent} from "./historiqueactionnaire.component";
import {HistoriqueactionnaireListComponent} from "./historiqueactionnaire-list/historiqueactionnaire-list.component";

const routes: Routes = [
  {
    path: '',
    component: HistoriqueactionnaireComponent,
    children: [
      { path: 'liste', component: HistoriqueactionnaireListComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'formejuridique', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriqueactionnaireRoutingModule { }
