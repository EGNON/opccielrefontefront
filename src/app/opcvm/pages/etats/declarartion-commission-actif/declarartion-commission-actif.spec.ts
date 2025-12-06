import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarartionCommissionActif } from './declarartion-commission-actif';

describe('DeclarartionCommissionActif', () => {
  let component: DeclarartionCommissionActif;
  let fixture: ComponentFixture<DeclarartionCommissionActif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclarartionCommissionActif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarartionCommissionActif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
