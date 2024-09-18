import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeobligationModalComponent } from './delete-typeobligation-modal.component';

describe('DeleteTypeobligationModalComponent', () => {
  let component: DeleteTypeobligationModalComponent;
  let fixture: ComponentFixture<DeleteTypeobligationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeobligationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeobligationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
