import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotificationsComponent} from "./notifications.component";
import {NotificationsListComponent} from "./notifications-list/notifications-list.component";
import {NotificationsAddEditComponent} from "./notifications-add-edit/notifications-add-edit.component";
import {NotificationsShowComponent} from "./notifications-show/notifications-show.component";

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    children: [
      { path: '', component: NotificationsListComponent, },
      { path: 'new', component: NotificationsAddEditComponent, },
      { path: 'edit/:id', component: NotificationsAddEditComponent, },
      { path: 'show/:id', component: NotificationsShowComponent, },
      { path: 'rappel/cr/:idCR', component: NotificationsAddEditComponent, },
      { path: 'notifications', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
