import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationnouvellerelationsupadixmillionsComponent } from './operationnouvellerelationsupadixmillions.component';

describe('OperationnouvellerelationsupadixmillionsComponent', () => {
  let component: OperationnouvellerelationsupadixmillionsComponent;
  let fixture: ComponentFixture<OperationnouvellerelationsupadixmillionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationnouvellerelationsupadixmillionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationnouvellerelationsupadixmillionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
