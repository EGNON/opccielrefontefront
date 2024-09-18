import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MoraleComponent} from "./morale.component";
import {MoraleListingComponent} from "./morale-listing/morale-listing.component";
import {MoraleDetailsComponent} from "./morale-details/morale-details.component";
import {MoraleShowingComponent} from "./morale-showing/morale-showing.component";

const routes: Routes = [
  {
    path: '',
    component: MoraleComponent,
    children: [
      { path: '', component: MoraleListingComponent, },
      { path: 'new', component: MoraleDetailsComponent, },
      { path: 'edit/:id', component: MoraleDetailsComponent, },
      { path: 'show/:id', component: MoraleShowingComponent, },
      { path: 'morale', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoraleRoutingModule { }
