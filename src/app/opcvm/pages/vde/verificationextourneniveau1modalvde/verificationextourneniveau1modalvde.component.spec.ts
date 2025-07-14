import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationextourneniveau1modalvdeComponent } from './verificationextourneniveau1modalvde.component';

describe('Verificationextourneniveau1modalvdeComponent', () => {
  let component: Verificationextourneniveau1modalvdeComponent;
  let fixture: ComponentFixture<Verificationextourneniveau1modalvdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationextourneniveau1modalvdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationextourneniveau1modalvdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
