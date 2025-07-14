import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau2modalvdeComponent } from './verificationniveau2modalvde.component';

describe('Verificationniveau2modalvdeComponent', () => {
  let component: Verificationniveau2modalvdeComponent;
  let fixture: ComponentFixture<Verificationniveau2modalvdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau2modalvdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau2modalvdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
