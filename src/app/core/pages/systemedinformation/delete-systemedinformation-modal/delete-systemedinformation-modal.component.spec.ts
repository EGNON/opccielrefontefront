import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSystemedinformationModalComponent } from './delete-systemedinformation-modal.component';

describe('DeleteSystemedinformationModalComponent', () => {
  let component: DeleteSystemedinformationModalComponent;
  let fixture: ComponentFixture<DeleteSystemedinformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSystemedinformationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSystemedinformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
