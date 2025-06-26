import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationniveau1vdeComponent } from './verificationniveau1vde.component';

describe('Verificationniveau1vdeComponent', () => {
  let component: Verificationniveau1vdeComponent;
  let fixture: ComponentFixture<Verificationniveau1vdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationniveau1vdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationniveau1vdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
