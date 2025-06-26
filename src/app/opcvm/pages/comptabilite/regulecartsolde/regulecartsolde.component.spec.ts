import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulecartsoldeComponent } from './regulecartsolde.component';

describe('RegulecartsoldeComponent', () => {
  let component: RegulecartsoldeComponent;
  let fixture: ComponentFixture<RegulecartsoldeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulecartsoldeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegulecartsoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
