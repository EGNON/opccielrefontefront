import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VdeComponent } from './vde.component';

describe('VdeComponent', () => {
  let component: VdeComponent;
  let fixture: ComponentFixture<VdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
