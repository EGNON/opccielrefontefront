import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleactionnaireF2 } from './portefeuilleactionnaire-f2';

describe('PortefeuilleactionnaireF2', () => {
  let component: PortefeuilleactionnaireF2;
  let fixture: ComponentFixture<PortefeuilleactionnaireF2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortefeuilleactionnaireF2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleactionnaireF2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
