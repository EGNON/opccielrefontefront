import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIntentionrachatModalComponent } from './delete-intentionrachat-modal.component';

describe('DeleteIntentionrachatModalComponent', () => {
  let component: DeleteIntentionrachatModalComponent;
  let fixture: ComponentFixture<DeleteIntentionrachatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteIntentionrachatModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteIntentionrachatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
