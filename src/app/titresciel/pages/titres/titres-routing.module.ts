import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TitresComponent} from "./titres.component";
import {TitresListingComponent} from "./titres-listing/titres-listing.component";
import {TitresDetailsComponent} from "./titres-details/titres-details.component";
import {TitresShowingComponent} from "./titres-showing/titres-showing.component";
import {TitresMajCoursComponent} from "./titres-maj-cours/titres-maj-cours.component";
import { TitresVerif1 } from './titres-verif1/titres-verif1';
import { TitresVerif2 } from './titres-verif2/titres-verif2';

const routes: Routes = [
  {
    path: '',
    component: TitresComponent,
    children: [
      { path: '', component: TitresListingComponent, },
      { path: 'new', component: TitresDetailsComponent, },
      { path: 'edit/:id', component: TitresDetailsComponent, },
      { path: 'show/:id', component: TitresShowingComponent, },
      { path: 'maj/cours', component: TitresMajCoursComponent, },
      { path: 'cours/verifiationniveau1', component: TitresVerif1, },
      { path: 'cours/verifiationniveau2', component: TitresVerif2, },
      { path: 'morale', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TitresRoutingModule { }

