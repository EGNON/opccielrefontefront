import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentionrachatListComponent } from './intentionrachat-list.component';

describe('IntentionrachatListComponent', () => {
  let component: IntentionrachatListComponent;
  let fixture: ComponentFixture<IntentionrachatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntentionrachatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntentionrachatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
