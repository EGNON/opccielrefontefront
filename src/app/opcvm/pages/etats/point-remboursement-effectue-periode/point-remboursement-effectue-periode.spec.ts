import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointRemboursementEffectuePeriode } from './point-remboursement-effectue-periode';

describe('PointRemboursementEffectuePeriode', () => {
  let component: PointRemboursementEffectuePeriode;
  let fixture: ComponentFixture<PointRemboursementEffectuePeriode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointRemboursementEffectuePeriode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointRemboursementEffectuePeriode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
