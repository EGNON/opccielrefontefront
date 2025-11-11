import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtatsComponent} from "./etats.component";
import {RegistreActionnaireComponent} from "./registre-actionnaire/registre-actionnaire.component";
import {PortefeuilleComponent} from "./portefeuille/portefeuille.component";
import {RelevetitrefcpComponent} from "./relevetitrefcp/relevetitrefcp.component";
import { Relevepartfcp } from './relevepartfcp/relevepartfcp';
import { Relevepartactionnaire } from './relevepartactionnaire/relevepartactionnaire';
import { Journal } from './journal/journal';
import { Soldecomptecomtable } from './soldecomptecomtable/soldecomptecomtable';
import { Balance } from './balance/balance';
import { Balanceavantinventaire } from './balanceavantinventaire/balanceavantinventaire';
import { Souscriptiondetaille } from './souscriptiondetaille/souscriptiondetaille';
import { Souscriptionglobal } from './souscriptionglobal/souscriptionglobal';
import { Rachatdetaille } from './rachatdetaille/rachatdetaille';
import { Rachatglobal } from './rachatglobal/rachatglobal';
import { Bilanannuelf1 } from './bilanannuelf1/bilanannuelf1';
import { Bilanannuelf2 } from './bilanannuelf2/bilanannuelf2';
import { Bilanannuelannexe } from './bilanannuelannexe/bilanannuelannexe';

const routes: Routes = [
  {
    path: '',
    component: EtatsComponent,
    children: [
      { path: 'registre/actionnaire', component: RegistreActionnaireComponent, },
      { path: 'portefeuille', component: PortefeuilleComponent, },
      { path: 'relevetitrefcp', component: RelevetitrefcpComponent, },
      { path: 'relevepartfcp', component: Relevepartfcp, },
      { path: 'relevepartactionnaire', component: Relevepartactionnaire, },
      { path: 'journal', component: Journal, },
      { path: 'soldecomptecomptable', component: Soldecomptecomtable, },
      { path: 'balance', component: Balance, },
      { path: 'balanceavantinventaire', component: Balanceavantinventaire, },
      { path: 'souscriptiondetaille', component: Souscriptiondetaille, },
      { path: 'souscriptionglobal', component: Souscriptionglobal, },
      { path: 'rachatdetaille', component: Rachatdetaille, },
      { path: 'rachatglobal', component: Rachatglobal, },
      { path: 'etatsfinanciers/:libelle', component: Bilanannuelf1, },
      { path: 'etatsfinanciersformat2/:libelle', component: Bilanannuelf2, },
      { path: 'etatsfinanciersannexes/:libelle', component: Bilanannuelannexe, },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }
