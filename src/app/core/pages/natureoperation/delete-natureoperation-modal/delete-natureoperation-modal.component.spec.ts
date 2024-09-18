import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNatureoperationModalComponent } from './delete-natureoperation-modal.component';

describe('DeleteNatureoperationModalComponent', () => {
  let component: DeleteNatureoperationModalComponent;
  let fixture: ComponentFixture<DeleteNatureoperationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteNatureoperationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteNatureoperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
