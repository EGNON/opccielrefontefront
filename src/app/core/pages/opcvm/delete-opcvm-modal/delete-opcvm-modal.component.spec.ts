import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOpcvmModalComponent } from './delete-opcvm-modal.component';

describe('DeleteOpcvmModalComponent', () => {
  let component: DeleteOpcvmModalComponent;
  let fixture: ComponentFixture<DeleteOpcvmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteOpcvmModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteOpcvmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
