import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Sanctiononu } from "./sanctiononu";
import { SanctiononuList } from "./sanctiononu-list/sanctiononu-list";


const routes: Routes = [
  {
    path: '',
    component: Sanctiononu,
    children: [
      { path: '', component: SanctiononuList, },
      { path: 'personne', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SanctionRoutingModule {
}
