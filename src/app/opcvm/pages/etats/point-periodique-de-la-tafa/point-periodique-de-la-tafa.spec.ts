import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointPeriodiqueDeLaTafa } from './point-periodique-de-la-tafa';

describe('PointPeriodiqueDeLaTafa', () => {
  let component: PointPeriodiqueDeLaTafa;
  let fixture: ComponentFixture<PointPeriodiqueDeLaTafa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointPeriodiqueDeLaTafa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointPeriodiqueDeLaTafa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
