import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeemetteurModalComponent } from './delete-typeemetteur-modal.component';

describe('DeleteTypeemetteurModalComponent', () => {
  let component: DeleteTypeemetteurModalComponent;
  let fixture: ComponentFixture<DeleteTypeemetteurModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeemetteurModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeemetteurModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
