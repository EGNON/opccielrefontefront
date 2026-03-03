import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { Definitionarrondi } from "./definitionarrondi";
import { DefinitionarrondiList } from "./definitionarrondi-list/definitionarrondi-list";
import { DefinitionarrondiAddEdit } from "./definitionarrondi-add-edit/definitionarrondi-add-edit";

const routes: Routes = [
  {
    path: '',
    component: Definitionarrondi,
    children: [
      { path: '', component: DefinitionarrondiList, },
      { path: 'new', component: DefinitionarrondiAddEdit, },
      { path: 'edit/:id', component: DefinitionarrondiAddEdit, },
      { path: 'pays', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefinitionArrondiRoutingModule {
}
