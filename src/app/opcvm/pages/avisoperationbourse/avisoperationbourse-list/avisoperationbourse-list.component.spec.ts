import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoperationbourseListComponent } from './avisoperationbourse-list.component';

describe('AvisoperationbourseListComponent', () => {
  let component: AvisoperationbourseListComponent;
  let fixture: ComponentFixture<AvisoperationbourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisoperationbourseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisoperationbourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
