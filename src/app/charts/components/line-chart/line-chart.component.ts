import {Component, Input} from '@angular/core';
import {StatisticsService} from "../../../core/services/statistics.service";
import {BehaviorSubject, tap} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrl: './line-chart.component.scss',
    standalone: false
})
export class LineChartComponent {
  @Input() title: string;
  @Input() description: string;

  @Input() chartOptions: any = {};

  constructor() {}
}
