import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verifsouscriptiontransferttitre } from './verifsouscriptiontransferttitre';

describe('Verifsouscriptiontransferttitre', () => {
  let component: Verifsouscriptiontransferttitre;
  let fixture: ComponentFixture<Verifsouscriptiontransferttitre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Verifsouscriptiontransferttitre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Verifsouscriptiontransferttitre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
