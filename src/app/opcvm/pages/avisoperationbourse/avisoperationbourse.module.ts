import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisoperationbourseComponent } from './avisoperationbourse.component';
import { AvisoperationbourseListComponent } from './avisoperationbourse-list/avisoperationbourse-list.component';
import { AvisoperationbourseAddEditComponent } from './avisoperationbourse-add-edit/avisoperationbourse-add-edit.component';
import { DeleteAvisoperationbourseModalComponent } from './delete-avisoperationbourse-modal/delete-avisoperationbourse-modal.component';



@NgModule({
  declarations: [
    AvisoperationbourseComponent,
    AvisoperationbourseListComponent,
    AvisoperationbourseAddEditComponent,
    DeleteAvisoperationbourseModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AvisoperationbourseModule { }
