import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { GenerationrachatComponent } from "./generationrachat.component";
import { GenerationrachatListComponent } from "./generationrachat-list/generationrachat-list.component";

const routes: Routes = [
  {
    path: '',
    component: GenerationrachatComponent,
    children: [
      { path: '', component: GenerationrachatListComponent, } ,
      // { path: 'show/:id', component: IntentionrachatShowComponent, },
      { path: 'Intentionrachat', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerationrachatRoutingModule {
}
