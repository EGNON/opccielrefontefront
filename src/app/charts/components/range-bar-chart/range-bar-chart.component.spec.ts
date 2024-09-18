import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeBarChartComponent } from './range-bar-chart.component';

describe('RangeBarChartComponent', () => {
  let component: RangeBarChartComponent;
  let fixture: ComponentFixture<RangeBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RangeBarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
