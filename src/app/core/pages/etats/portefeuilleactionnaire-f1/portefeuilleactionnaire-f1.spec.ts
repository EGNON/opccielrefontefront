import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleactionnaireF1 } from './portefeuilleactionnaire-f1';

describe('PortefeuilleactionnaireF1', () => {
  let component: PortefeuilleactionnaireF1;
  let fixture: ComponentFixture<PortefeuilleactionnaireF1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortefeuilleactionnaireF1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleactionnaireF1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
