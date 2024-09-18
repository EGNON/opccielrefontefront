import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SoustypeactionComponent} from "./soustypeaction.component";
import {SoustypeactionListComponent} from "./soustypeaction-list/soustypeaction-list.component";
import {SoustypeactionAddEditComponent} from "./soustypeaction-add-edit/soustypeaction-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: SoustypeactionComponent,
    children: [
      { path: '', component: SoustypeactionListComponent, },
      { path: 'new', component: SoustypeactionAddEditComponent, },
      { path: 'edit/:id', component: SoustypeactionAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'soustypeaction', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoustypeactionRoutingModule { }
