import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModeleformuleModalComponent } from './delete-modeleformule-modal.component';

describe('DeleteModeleformuleModalComponent', () => {
  let component: DeleteModeleformuleModalComponent;
  let fixture: ComponentFixture<DeleteModeleformuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModeleformuleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModeleformuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
