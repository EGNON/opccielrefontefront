import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Affectationresultat } from './affectationresultat';

describe('Affectationresultat', () => {
  let component: Affectationresultat;
  let fixture: ComponentFixture<Affectationresultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Affectationresultat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Affectationresultat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
