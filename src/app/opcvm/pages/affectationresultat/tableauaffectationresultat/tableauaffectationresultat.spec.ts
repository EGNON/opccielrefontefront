import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tableauaffectationresultat } from './tableauaffectationresultat';

describe('Tableauaffectationresultat', () => {
  let component: Tableauaffectationresultat;
  let fixture: ComponentFixture<Tableauaffectationresultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tableauaffectationresultat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tableauaffectationresultat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
