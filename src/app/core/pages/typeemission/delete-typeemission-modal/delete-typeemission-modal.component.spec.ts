import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeemissionModalComponent } from './delete-typeemission-modal.component';

describe('DeleteTypeemissionModalComponent', () => {
  let component: DeleteTypeemissionModalComponent;
  let fixture: ComponentFixture<DeleteTypeemissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeemissionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeemissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
