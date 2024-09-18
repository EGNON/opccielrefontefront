import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAddEditComponent } from './plan-add-edit.component';

describe('PlanAddEditComponent', () => {
  let component: PlanAddEditComponent;
  let fixture: ComponentFixture<PlanAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
