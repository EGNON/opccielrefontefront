import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phasepaiement } from './phasepaiement';

describe('Phasepaiement', () => {
  let component: Phasepaiement;
  let fixture: ComponentFixture<Phasepaiement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Phasepaiement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Phasepaiement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
