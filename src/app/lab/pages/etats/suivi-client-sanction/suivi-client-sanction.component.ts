import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, Subscription, tap} from "rxjs";
import {ReportingsService} from "../../../services/reportings/reportings.service";

@Component({
  selector: 'app-suivi-client-sanction',
  templateUrl: './suivi-client-sanction.component.html',
  styleUrl: './suivi-client-sanction.component.scss'
})
export class SuiviClientSanctionComponent implements OnInit, OnDestroy{
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;

  constructor(private reportingsService: ReportingsService) { }

  ngOnInit(): void {
    let groupColumn = 2;
    this.dtOptions = {
      ...this.reportingsService.dtOptions,
      columnDefs: [{ visible: false, targets: groupColumn }],
      order: [[groupColumn, 'asc']],
      drawCallback: function (settings:any) {
        let api = this.api();
        let rows = api.rows({page:'current'} ).nodes();
        let last: any = null;
        api.column(groupColumn, {page:'current'} ).data().each(function (group: any, i: any) {
          if (last !== group) {
            $(rows).eq(i).before(
              '<tr style="background-color:#49bbf1" class="group"><th colspan="5">'+group+'</th></tr>'
            );
            last = group;
          }
        });
      }
    };
    this.reportList$ = this.reportingsService.suiviClientSanction().pipe(
      tap(() => this.dtTrigger.next(null))
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
