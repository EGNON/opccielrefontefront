import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIbrubriquepositionModalComponent } from './delete-ibrubriqueposition-modal.component';

describe('DeleteIbrubriquepositionModalComponent', () => {
  let component: DeleteIbrubriquepositionModalComponent;
  let fixture: ComponentFixture<DeleteIbrubriquepositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteIbrubriquepositionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteIbrubriquepositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
