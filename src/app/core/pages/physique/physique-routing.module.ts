import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PhysiqueComponent} from "./physique.component";
import {PhysiqueListingComponent} from "./physique-listing/physique-listing.component";
import {PhysiqueDetailsComponent} from "./physique-details/physique-details.component";
import {PhysiqueShowingComponent} from "./physique-showing/physique-showing.component";

const routes: Routes = [
  {
    path: '',
    component: PhysiqueComponent,
    children: [
      { path: '', component: PhysiqueListingComponent, },
      { path: 'new/:qualite', component: PhysiqueDetailsComponent, },
      { path: 'edit/:qualite/:id', component: PhysiqueDetailsComponent, },
      { path: 'show/:qualite/:id', component: PhysiqueShowingComponent, },
      { path: 'physique', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysiqueRoutingModule { }
