import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointInvestissement } from './point-investissement';

describe('PointInvestissement', () => {
  let component: PointInvestissement;
  let fixture: ComponentFixture<PointInvestissement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointInvestissement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointInvestissement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
