import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotsuperieuracinqmillionsComponent } from './depotsuperieuracinqmillions.component';

describe('DepotsuperieuracinqmillionsComponent', () => {
  let component: DepotsuperieuracinqmillionsComponent;
  let fixture: ComponentFixture<DepotsuperieuracinqmillionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepotsuperieuracinqmillionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotsuperieuracinqmillionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
