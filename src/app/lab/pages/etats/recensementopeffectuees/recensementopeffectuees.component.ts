import {Component, OnInit, ViewChild} from '@angular/core';
import {ReportingsService} from "../../../services/reportings/reportings.service";
import {Observable, Subject, Subscription, tap} from "rxjs";

@Component({
    selector: 'app-recensementopeffectuees',
    templateUrl: './recensementopeffectuees.component.html',
    styleUrl: './recensementopeffectuees.component.scss',
    standalone: false
})
export class RecensementopeffectueesComponent implements OnInit{
  // dtOptions: Config = {};
  @ViewChild('dataTable') table: any;
  dataTable: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;

  private subscriptions: Subscription[] = [];

  constructor(private reportingsService: ReportingsService) { }

  ngOnInit(): void {
    let groupColumn = 1;
    this.dtOptions = {
      ...this.reportingsService.dtOptions,
      /*columnDefs: [
        { type: 'date-uk', targets: 1}  // specifying date format
      ],*/
      columnDefs: [{ visible: false, targets: groupColumn }],
      order: [[groupColumn, 'asc']],
      drawCallback: function (settings:any) {
        let api = this.api();
        let rows = api.rows({page:'current'} ).nodes();
        let last: any = null;
        api.column(groupColumn, {page:'current'} ).data().each(function (group: any, i: any) {
          console.log("LAST === ", last);
          console.log("GROUP === ", group);
          if (last !== group) {
            $(rows).eq(i).before(
              '<tr style="background-color:#49bbf1" class="group"><th colspan="5">'+group+'</th></tr>'
            );
            last = group;
          }
        });
      }
    };
    this.reportList$ = this.reportingsService.recensementopeffectuees().pipe(
      tap(() => this.dtTrigger.next(null))
    );

    /*this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable(this.dtOptions);*/
  }
}
