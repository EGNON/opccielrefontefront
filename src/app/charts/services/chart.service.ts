import { Injectable } from '@angular/core';
import {getCSSVariableValue} from "../../template/_metronic/kt/_utils";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getChartOptions(
    height: number,
    chartType: 'line' | 'area' | 'bar',
    series: [{name: string, data: []}]) {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-primary')
    const secondaryColor = getCSSVariableValue('--bs-gray-300')

    return {
      series: series,
      chart: {
        fontFamily: 'inherit',
        type: chartType,
        height: height,
        toolbar: {
          show: true,
        },
      },
      annotations: this.getAnnotation(),
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend: {
        show: true,
        position: 'top'
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val: number) {
            return '$' + val + ' thousands';
          },
        },
      },
      colors: [baseColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    };
  }

  getAnnotation() {

    return {
      yaxis: [{
        y: 0,
        y2: null,
        strokeDashArray: 1,
        borderColor: '#c2c2c2',
        fillColor: '#c2c2c2',
        opacity: 0.3,
        offsetX: 0,
        offsetY: -3,
        width: '100%',
        yAxisIndex: 0,
        label: {
          borderColor: '#c2c2c2',
          borderWidth: 1,
          borderRadius: 2,
          text: undefined,
          textAnchor: 'end',
          position: 'right',
          offsetX: 0,
          offsetY: 0,
          mouseEnter: undefined,
          mouseLeave: undefined,
          click: undefined,
          style: {
            background: '#fff',
            color: '#777',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: 'apexcharts-yaxis-annotation-label',
            padding: {
              left: 5,
              right: 5,
              top: 0,
              bottom: 2,
            }
          },
        },
      }],
      xaxis: [{
        x: 0,
        x2: null,
        strokeDashArray: 1,
        borderColor: '#c2c2c2',
        fillColor: '#c2c2c2',
        opacity: 0.3,
        offsetX: 0,
        offsetY: 0,
        label: {
          borderColor: '#c2c2c2',
          borderWidth: 1,
          borderRadius: 2,
          text: undefined,
          textAnchor: 'middle',
          position: 'top',
          orientation: 'vertical',
          offsetX: 0,
          offsetY: 0,
          mouseEnter: undefined,
          mouseLeave: undefined,
          click: undefined,
          style: {
            background: '#fff',
            color: '#777',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: 'apexcharts-xaxis-annotation-label',
          },
        },
      }],
      points: [{
        x: 0,
        y: null,
        yAxisIndex: 0,
        seriesIndex: 0,
        mouseEnter: undefined,
        mouseLeave: undefined,
        click: undefined,
        marker: {
          size: 0,
          fillColor: "#fff",
          strokeColor: "#333",
          strokeWidth: 3,
          shape: "circle",
          radius: 2,
          OffsetX: 0,
          OffsetY: 0,
          cssClass: '',
        },
        label: {
          borderColor: '#c2c2c2',
          borderWidth: 1,
          borderRadius: 2,
          text: undefined,
          textAnchor: 'middle',
          offsetX: 0,
          offsetY: -15,
          mouseEnter: undefined,
          mouseLeave: undefined,
          click: undefined,
          style: {
            background: '#fff',
            color: '#777',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: 'apexcharts-point-annotation-label',
            padding: {
              left: 5,
              right: 5,
              top: 0,
              bottom: 2,
            }
          },
        },
        image: {
          path: undefined,
          width: 20,
          height: 20,
          offsetX: 0,
          offsetY: 0,
        }
      }],
      texts: [{
        x: 0,
        y: 0,
        text: '',
        textAnchor: 'start',
        foreColor: undefined,
        fontSize: '13px',
        fontFamily: undefined,
        fontWeight: 400,
        appendTo: '.apexcharts-annotations',
        backgroundColor: 'transparent',
        borderColor: '#c2c2c2',
        borderRadius: 0,
        borderWidth: 0,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
      }],
      images: [{
        path: '',
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        appendTo: '.apexcharts-annotations'
      }],
    };
  }
}
