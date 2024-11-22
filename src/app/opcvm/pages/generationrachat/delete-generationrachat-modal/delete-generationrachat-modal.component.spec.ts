import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGenerationrachatModalComponent } from './delete-generationrachat-modal.component';

describe('DeleteGenerationrachatModalComponent', () => {
  let component: DeleteGenerationrachatModalComponent;
  let fixture: ComponentFixture<DeleteGenerationrachatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteGenerationrachatModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteGenerationrachatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
