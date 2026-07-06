import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Circulaire9Print } from './circulaire9-print';

describe('Circulaire9Print', () => {
  let component: Circulaire9Print;
  let fixture: ComponentFixture<Circulaire9Print>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Circulaire9Print]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Circulaire9Print);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
