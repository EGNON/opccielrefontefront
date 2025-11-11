import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Balanceavantinventaire } from './balanceavantinventaire';

describe('Balanceavantinventaire', () => {
  let component: Balanceavantinventaire;
  let fixture: ComponentFixture<Balanceavantinventaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Balanceavantinventaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Balanceavantinventaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
