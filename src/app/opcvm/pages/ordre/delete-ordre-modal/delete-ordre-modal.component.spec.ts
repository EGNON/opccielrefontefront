import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOrdreModalComponent } from './delete-ordre-modal.component';

describe('DeleteOrdreModalComponent', () => {
  let component: DeleteOrdreModalComponent;
  let fixture: ComponentFixture<DeleteOrdreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteOrdreModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteOrdreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
