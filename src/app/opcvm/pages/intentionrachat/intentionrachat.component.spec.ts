import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionrachatComponent } from './intentionrachat.component';

describe('IntentionrachatComponent', () => {
  let component: IntentionrachatComponent;
  let fixture: ComponentFixture<IntentionrachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntentionrachatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntentionrachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
