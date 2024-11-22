import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifintentionrachatComponent } from './verifintentionrachat.component';

describe('VerifintentionrachatComponent', () => {
  let component: VerifintentionrachatComponent;
  let fixture: ComponentFixture<VerifintentionrachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifintentionrachatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifintentionrachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
