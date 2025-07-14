import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationecriturechargeniveau1Component } from './verificationecriturechargeniveau1.component';

describe('Verificationecriturechargeniveau1Component', () => {
  let component: Verificationecriturechargeniveau1Component;
  let fixture: ComponentFixture<Verificationecriturechargeniveau1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationecriturechargeniveau1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationecriturechargeniveau1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
