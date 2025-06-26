import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau1modalvdeComponent } from './verificationniveau1modalvde.component';

describe('Verificationniveau1modalvdeComponent', () => {
  let component: Verificationniveau1modalvdeComponent;
  let fixture: ComponentFixture<Verificationniveau1modalvdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau1modalvdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau1modalvdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
