import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypegarantModalComponent } from './delete-typegarant-modal.component';

describe('DeleteTypegarantModalComponent', () => {
  let component: DeleteTypegarantModalComponent;
  let fixture: ComponentFixture<DeleteTypegarantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypegarantModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypegarantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
