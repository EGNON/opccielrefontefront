import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxPlotChartComponent } from './box-plot-chart.component';

describe('BoxPlotChartComponent', () => {
  let component: BoxPlotChartComponent;
  let fixture: ComponentFixture<BoxPlotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxPlotChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxPlotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
