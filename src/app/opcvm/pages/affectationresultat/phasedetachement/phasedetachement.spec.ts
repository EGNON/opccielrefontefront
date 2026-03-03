import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phasedetachement } from './phasedetachement';

describe('Phasedetachement', () => {
  let component: Phasedetachement;
  let fixture: ComponentFixture<Phasedetachement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Phasedetachement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Phasedetachement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
