import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypecompteModalComponent } from './delete-typecompte-modal.component';

describe('DeleteTypecompteModalComponent', () => {
  let component: DeleteTypecompteModalComponent;
  let fixture: ComponentFixture<DeleteTypecompteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypecompteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypecompteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
