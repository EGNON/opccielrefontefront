import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChargeModalComponent } from './delete-charge-modal.component';

describe('DeleteChargeModalComponent', () => {
  let component: DeleteChargeModalComponent;
  let fixture: ComponentFixture<DeleteChargeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteChargeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteChargeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
