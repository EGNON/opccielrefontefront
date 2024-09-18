import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypemodeleModalComponent } from './delete-typemodele-modal.component';

describe('DeleteTypemodeleModalComponent', () => {
  let component: DeleteTypemodeleModalComponent;
  let fixture: ComponentFixture<DeleteTypemodeleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypemodeleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypemodeleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
