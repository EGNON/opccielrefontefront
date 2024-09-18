import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeoperationModalComponent } from './delete-typeoperation-modal.component';

describe('DeleteTypeoperationModalComponent', () => {
  let component: DeleteTypeoperationModalComponent;
  let fixture: ComponentFixture<DeleteTypeoperationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeoperationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeoperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
