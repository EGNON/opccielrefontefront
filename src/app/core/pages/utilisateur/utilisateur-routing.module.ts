import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UtilisateurComponent} from "./utilisateur.component";
import {UtilisateurListComponent} from "./utilisateur-list/utilisateur-list.component";
import {UtilisateurAddEditComponent} from "./utilisateur-add-edit/utilisateur-add-edit.component";
import {UtilisateurShowComponent} from "./utilisateur-show/utilisateur-show.component";
import {checkRoleAccessGuard} from "../../../auth/check-role-access.guard";
import {checkPermissionAccessGuard} from "../../../auth/check-permission-access.guard";

const routes: Routes = [
  {
    path: '',
    component: UtilisateurComponent,
    /*data: { role: 'ROLE_UTILISATEUR' },
    canActivateChild: [checkPermissionAccessGuard],*/
    children: [
      { path: '', component: UtilisateurListComponent, },
      { path: 'new', component: UtilisateurAddEditComponent },
      { path: 'edit/:id', component: UtilisateurAddEditComponent, },
      { path: 'show/:id', component: UtilisateurShowComponent, },
      { path: 'utilisateurs', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
