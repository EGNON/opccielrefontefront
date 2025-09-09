import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Performanceportefeuilleactionnaire } from './performanceportefeuilleactionnaire';

describe('Performanceportefeuilleactionnaire', () => {
  let component: Performanceportefeuilleactionnaire;
  let fixture: ComponentFixture<Performanceportefeuilleactionnaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Performanceportefeuilleactionnaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Performanceportefeuilleactionnaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
