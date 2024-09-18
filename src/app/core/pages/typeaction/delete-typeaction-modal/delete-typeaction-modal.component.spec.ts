import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeactionModalComponent } from './delete-typeaction-modal.component';

describe('DeleteTypeactionModalComponent', () => {
  let component: DeleteTypeactionModalComponent;
  let fixture: ComponentFixture<DeleteTypeactionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTypeactionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTypeactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
