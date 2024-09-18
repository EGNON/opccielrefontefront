import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSoustypecompteModalComponent } from './delete-soustypecompte-modal.component';

describe('DeleteSoustypecompteModalComponent', () => {
  let component: DeleteSoustypecompteModalComponent;
  let fixture: ComponentFixture<DeleteSoustypecompteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSoustypecompteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSoustypecompteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
