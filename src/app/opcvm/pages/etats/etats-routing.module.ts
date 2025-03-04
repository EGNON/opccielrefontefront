import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "./etats.component";
import {RegistreActionnaireComponent} from "./registre-actionnaire/registre-actionnaire.component";

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'registre/actionnaire', component: RegistreActionnaireComponent, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }
