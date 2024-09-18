import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LangueComponent} from "./langue.component";
import {LangueListComponent} from "./langue-list/langue-list.component";
import {LangueAddEditComponent} from "./langue-add-edit/langue-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: LangueComponent,
    children: [
      { path: '', component: LangueListComponent, },
      { path: 'new', component: LangueAddEditComponent, },
      { path: 'edit/:id', component: LangueAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Langue', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LangueRoutingModule { }
