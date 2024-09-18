import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSoustypeactionModalComponent } from './delete-soustypeaction-modal.component';

describe('DeleteSoustypeactionModalComponent', () => {
  let component: DeleteSoustypeactionModalComponent;
  let fixture: ComponentFixture<DeleteSoustypeactionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSoustypeactionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSoustypeactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
