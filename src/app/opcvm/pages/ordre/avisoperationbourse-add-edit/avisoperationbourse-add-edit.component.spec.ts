import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoperationbourseAddEditComponent } from './avisoperationbourse-add-edit.component';

describe('AvisoperationbourseAddEditComponent', () => {
  let component: AvisoperationbourseAddEditComponent;
  let fixture: ComponentFixture<AvisoperationbourseAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisoperationbourseAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisoperationbourseAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
