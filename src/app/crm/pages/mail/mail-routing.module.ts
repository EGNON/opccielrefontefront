import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MailComponent} from "./mail.component";
import {MailListComponent} from "./mail-list/mail-list.component";
import {MailCreateComponent} from "./mail-create/mail-create.component";
import {MailShowComponent} from "./mail-show/mail-show.component";

const routes: Routes = [
  {
    path: '',
    component: MailComponent,
    children: [
      { path: '', component: MailListComponent, },
      { path: 'new', component: MailCreateComponent, },
      { path: 'edit/:id', component: MailCreateComponent, },
      { path: 'view/:id', component: MailShowComponent, },
      { path: 'monnaie', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailRoutingModule {}
