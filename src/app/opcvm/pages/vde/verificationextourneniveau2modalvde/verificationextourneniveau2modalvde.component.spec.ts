import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verificationextourneniveau2modalvdeComponent } from './verificationextourneniveau2modalvde.component';

describe('Verificationextourneniveau2modalvdeComponent', () => {
  let component: Verificationextourneniveau2modalvdeComponent;
  let fixture: ComponentFixture<Verificationextourneniveau2modalvdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verificationextourneniveau2modalvdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verificationextourneniveau2modalvdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
