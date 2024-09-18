import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JournalComponent} from "./journal.component";
import {JournalListComponent} from "./journal-list/journal-list.component";
import {JournalAddEditComponent} from "./journal-add-edit/journal-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: JournalComponent,
    children: [
      { path: '', component: JournalListComponent, },
      { path: 'new', component: JournalAddEditComponent, },
      { path: 'edit/:id', component: JournalAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'Journal', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalRoutingModule { }
