import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleactionnaireAnnee } from './portefeuilleactionnaire-annee';

describe('PortefeuilleactionnaireAnnee', () => {
  let component: PortefeuilleactionnaireAnnee;
  let fixture: ComponentFixture<PortefeuilleactionnaireAnnee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortefeuilleactionnaireAnnee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleactionnaireAnnee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
