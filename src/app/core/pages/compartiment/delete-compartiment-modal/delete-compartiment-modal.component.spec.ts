import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCompartimentModalComponent } from './delete-compartiment-modal.component';

describe('DeleteCompartimentModalComponent', () => {
  let component: DeleteCompartimentModalComponent;
  let fixture: ComponentFixture<DeleteCompartimentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCompartimentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCompartimentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
