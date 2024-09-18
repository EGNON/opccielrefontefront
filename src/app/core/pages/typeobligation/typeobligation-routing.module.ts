import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TypeobligationComponent} from "./typeobligation.component";
import {TypeobligationListComponent} from "./typeobligation-list/typeobligation-list.component";
import {TypeobligationAddEditComponent} from "./typeobligation-add-edit/typeobligation-add-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TypeobligationComponent,
    children: [
      { path: '', component: TypeobligationListComponent, },
      { path: 'new', component: TypeobligationAddEditComponent, },
      { path: 'edit/:id', component: TypeobligationAddEditComponent, },
      // { path: 'show/:id', component: SecteurShowComponent, },
      { path: 'typeobligation', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeobligationRoutingModule { }
