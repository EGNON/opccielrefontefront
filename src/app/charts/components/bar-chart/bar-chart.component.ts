import {Component, ViewChild} from '@angular/core';
import {series} from "./data";
import {ChartComponent} from "ng-apexcharts";



@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrl: './bar-chart.component.scss',
    standalone: false
})
export class BarChartComponent {
  @ViewChild('chart') chart: ChartComponent;
  //public chartOptions: Partial<ChartOptions>;
  public chartOptions: any = {};

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'image_url',
          data: series.monthDataSeries1.prices,
        },
        {
          name: 'secondary_heading',
          data: series.monthDataSeries2.prices,
        },
      ],
      chart: {
        type: 'line',
      },
      annotations: {
        points: [
          {
            x: new Date('14 Nov 2017').getTime(),
            y: 8900,
            marker: {
              size: 6,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              text: 'Data feature',
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
            },
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 3,
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
      title: {
        text: 'Notification anomalies',
        align: 'left',
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: 'datetime',
      },
    };
  }
}
