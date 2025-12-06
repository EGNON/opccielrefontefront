import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviEcheanceTitre } from './suivi-echeance-titre';

describe('SuiviEcheanceTitre', () => {
  let component: SuiviEcheanceTitre;
  let fixture: ComponentFixture<SuiviEcheanceTitre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuiviEcheanceTitre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviEcheanceTitre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
