import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModeleecritureModalComponent } from './delete-modeleecriture-modal.component';

describe('DeleteModeleecritureModalComponent', () => {
  let component: DeleteModeleecritureModalComponent;
  let fixture: ComponentFixture<DeleteModeleecritureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModeleecritureModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteModeleecritureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
