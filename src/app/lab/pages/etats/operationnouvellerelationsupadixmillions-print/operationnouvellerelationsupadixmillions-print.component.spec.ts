import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationnouvellerelationsupadixmillionsPrintComponent } from './operationnouvellerelationsupadixmillions-print.component';

describe('OperationnouvellerelationsupadixmillionsPrintComponent', () => {
  let component: OperationnouvellerelationsupadixmillionsPrintComponent;
  let fixture: ComponentFixture<OperationnouvellerelationsupadixmillionsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationnouvellerelationsupadixmillionsPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationnouvellerelationsupadixmillionsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
