import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsuperieuracinqmillionsPrintComponent } from './depotsuperieuracinqmillions-print.component';

describe('DepotsuperieuracinqmillionsPrintComponent', () => {
  let component: DepotsuperieuracinqmillionsPrintComponent;
  let fixture: ComponentFixture<DepotsuperieuracinqmillionsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsuperieuracinqmillionsPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsuperieuracinqmillionsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
