import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoperationbourseComponent } from './avisoperationbourse.component';

describe('AvisoperationbourseComponent', () => {
  let component: AvisoperationbourseComponent;
  let fixture: ComponentFixture<AvisoperationbourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisoperationbourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvisoperationbourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
