import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSocietedegestionModalComponent } from './delete-societedegestion-modal.component';

describe('DeleteSocietedegestionModalComponent', () => {
  let component: DeleteSocietedegestionModalComponent;
  let fixture: ComponentFixture<DeleteSocietedegestionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSocietedegestionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSocietedegestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
