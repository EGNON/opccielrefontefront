import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "../../../lab/pages/etats/etats.component";
import {VolatiliteComponent} from "./volatilite/volatilite.component";
import {AlphaComponent} from "./alpha/alpha.component";
import {RatiosharpComponent} from "./ratiosharp/ratiosharp.component";

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'volatilite/fcp', component: VolatiliteComponent, },
      { path: 'alpha/liste', component: AlphaComponent, },
      { path: 'ratiosharp/liste', component: RatiosharpComponent, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }
