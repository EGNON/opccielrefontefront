import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationecriturechargeniveau2Component } from './verificationecriturechargeniveau2.component';

describe('Verificationecriturechargeniveau2Component', () => {
  let component: Verificationecriturechargeniveau2Component;
  let fixture: ComponentFixture<Verificationecriturechargeniveau2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationecriturechargeniveau2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationecriturechargeniveau2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
