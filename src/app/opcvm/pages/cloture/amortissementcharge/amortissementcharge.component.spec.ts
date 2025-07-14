import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortissementchargeComponent } from './amortissementcharge.component';

describe('AmortissementchargeComponent', () => {
  let component: AmortissementchargeComponent;
  let fixture: ComponentFixture<AmortissementchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmortissementchargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmortissementchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
