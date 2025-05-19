import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAvisoperationbourseModalComponent } from './delete-avisoperationbourse-modal.component';

describe('DeleteAvisoperationbourseModalComponent', () => {
  let component: DeleteAvisoperationbourseModalComponent;
  let fixture: ComponentFixture<DeleteAvisoperationbourseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAvisoperationbourseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteAvisoperationbourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
