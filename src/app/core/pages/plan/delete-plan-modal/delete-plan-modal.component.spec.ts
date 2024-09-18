import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlanModalComponent } from './delete-plan-modal.component';

describe('DeletePlanModalComponent', () => {
  let component: DeletePlanModalComponent;
  let fixture: ComponentFixture<DeletePlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePlanModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
