import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFormuleModalComponent } from './delete-formule-modal.component';

describe('DeleteFormuleModalComponent', () => {
  let component: DeleteFormuleModalComponent;
  let fixture: ComponentFixture<DeleteFormuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteFormuleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFormuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
