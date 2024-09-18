import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DropdownMenusModule, ModalsModule, WidgetsModule} from "../template/_metronic/partials";
import {RouterModule} from "@angular/router";
import {NgApexchartsModule} from "ng-apexcharts";
import {BarChartComponent} from "../charts/components/bar-chart/bar-chart.component";
import {AreaChartComponent} from "../charts/components/area-chart/area-chart.component";
import {LineChartComponent} from "../charts/components/line-chart/line-chart.component";
import {PieChartComponent} from "../charts/components/pie-chart/pie-chart.component";
import {DonutChartComponent} from "../charts/components/donut-chart/donut-chart.component";
import {RadialBarChartComponent} from "../charts/components/radial-bar-chart/radial-bar-chart.component";
import {ScatterChartComponent} from "../charts/components/scatter-chart/scatter-chart.component";
import {BubbleChartComponent} from "../charts/components/bubble-chart/bubble-chart.component";
import {HeatmapChartComponent} from "../charts/components/heatmap-chart/heatmap-chart.component";
import {CandlestickChartComponent} from "../charts/components/candlestick-chart/candlestick-chart.component";
import {BoxPlotChartComponent} from "../charts/components/box-plot-chart/box-plot-chart.component";
import {RadarChartComponent} from "../charts/components/radar-chart/radar-chart.component";
import {PolarAreaChartComponent} from "../charts/components/polar-area-chart/polar-area-chart.component";
import {RangeBarChartComponent} from "../charts/components/range-bar-chart/range-bar-chart.component";
import {RangeAreaChartComponent} from "../charts/components/range-area-chart/range-area-chart.component";
import {TreemapChartComponent} from "../charts/components/treemap-chart/treemap-chart.component";
import {SharedModule} from "../template/_metronic/shared/shared.module";

@NgModule({
  declarations: [
    DashboardComponent,
    BarChartComponent,
    LineChartComponent,
    AreaChartComponent,
    BarChartComponent,
    PieChartComponent,
    DonutChartComponent,
    RadialBarChartComponent,
    ScatterChartComponent,
    BubbleChartComponent,
    HeatmapChartComponent,
    CandlestickChartComponent,
    BoxPlotChartComponent,
    RadarChartComponent,
    PolarAreaChartComponent,
    RangeBarChartComponent,
    RangeAreaChartComponent,
    TreemapChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgApexchartsModule,
    DropdownMenusModule,
    SharedModule
  ]
})
export class DashboardModule { }
