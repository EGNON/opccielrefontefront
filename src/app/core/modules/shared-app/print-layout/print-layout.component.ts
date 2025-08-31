import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

export class ReportSize {
  width: number;
  height: number;
}

@Component({
    selector: 'reportings-print-layout',
    templateUrl: './print-layout.component.html',
    styleUrl: './print-layout.component.scss',
    standalone: false
})
export class PrintLayoutComponent implements OnInit, AfterViewInit{

  @ViewChild('container') container: ElementRef;
  @Input() title: string;
  @Input() table: boolean = false;
  reportSize: ReportSize;
  @Output() reportSizeEvent = new EventEmitter<ReportSize>();
  dtOptions: any = {};
  today: any;

  constructor() {
    this.today = 'Imprimé le ' + (new Date()).toLocaleDateString();
  }

  getSize() {
    this.reportSizeEvent.emit(this.reportSize);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.reportSize = {
      width: this.container.nativeElement.offsetWidth,
      height: this.container.nativeElement.offsetHeight
    };
    console.log("container === ", this.container.nativeElement.offsetWidth);
  }
}
