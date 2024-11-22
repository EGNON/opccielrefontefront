import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau1Component } from './verificationniveau1.component';

describe('Verificationniveau1Component', () => {
  let component: Verificationniveau1Component;
  let fixture: ComponentFixture<Verificationniveau1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
