import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionrachatAddEditComponent } from './intentionrachat-add-edit.component';

describe('IntentionrachatAddEditComponent', () => {
  let component: IntentionrachatAddEditComponent;
  let fixture: ComponentFixture<IntentionrachatAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntentionrachatAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntentionrachatAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
