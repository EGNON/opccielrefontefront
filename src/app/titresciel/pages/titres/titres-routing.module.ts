import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TitresComponent} from "./titres.component";
import {TitresListingComponent} from "./titres-listing/titres-listing.component";
import {TitresDetailsComponent} from "./titres-details/titres-details.component";
import {TitresShowingComponent} from "./titres-showing/titres-showing.component";
import {TitresMajCoursComponent} from "./titres-maj-cours/titres-maj-cours.component";

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

