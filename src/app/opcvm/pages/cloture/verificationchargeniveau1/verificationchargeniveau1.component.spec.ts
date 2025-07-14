import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationchargeniveau1Component } from './verificationchargeniveau1.component';

describe('Verificationchargeniveau1Component', () => {
  let component: Verificationchargeniveau1Component;
  let fixture: ComponentFixture<Verificationchargeniveau1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationchargeniveau1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationchargeniveau1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
