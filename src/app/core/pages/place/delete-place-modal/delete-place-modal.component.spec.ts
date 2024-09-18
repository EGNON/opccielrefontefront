import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlaceModalComponent } from './delete-place-modal.component';

describe('DeletePlaceModalComponent', () => {
  let component: DeletePlaceModalComponent;
  let fixture: ComponentFixture<DeletePlaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePlaceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePlaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
