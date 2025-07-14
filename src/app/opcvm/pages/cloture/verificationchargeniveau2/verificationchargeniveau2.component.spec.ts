import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationchargeniveau2Component } from './verificationchargeniveau2.component';

describe('Verificationchargeniveau2Component', () => {
  let component: Verificationchargeniveau2Component;
  let fixture: ComponentFixture<Verificationchargeniveau2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationchargeniveau2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationchargeniveau2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
